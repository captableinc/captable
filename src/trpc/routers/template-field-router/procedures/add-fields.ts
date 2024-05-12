/* eslint-disable @typescript-eslint/prefer-for-of */
import { withAuth } from '@/trpc/api/trpc'
import { ZodAddFieldMutationSchema } from '../schema'

import type { TEsignEmailJob } from '@/jobs/esign-email'
import { sendEsignEmail } from '@/jobs/esign-email'
import { decode, encode } from '@/lib/jwt'
import { checkMembership } from '@/server/auth'
import { getTriggerClient } from '@/trigger'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const emailTokenPayloadSchema = z.object({
  id: z.string(),
  rec: z.string(),
})

type TEmailTokenPayloadSchema = z.infer<typeof emailTokenPayloadSchema>

interface EncodeEmailTokenOption {
  templateId: string
  recipientId: string
}

export function EncodeEmailToken({
  recipientId,
  templateId,
}: EncodeEmailTokenOption) {
  const encodeToken: TEmailTokenPayloadSchema = {
    rec: recipientId,
    id: templateId,
  }

  return encode(encodeToken)
}

export async function DecodeEmailToken(jwt: string) {
  const { payload } = await decode(jwt)
  return emailTokenPayloadSchema.parse(payload)
}

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const user = ctx.session.user
      const triggerClient = getTriggerClient()

      const mails: TEsignEmailJob[] = []

      if (input.status === 'COMPLETE' && (!user.email || !user.name)) {
        return {
          success: false,
          title: 'Validation failed',
          message: 'Required sender name and email',
        }
      }

      await ctx.db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({
          tx,
          session: ctx.session,
        })

        const template = await tx.template.findFirstOrThrow({
          where: {
            publicId: input.templatePublicId,
            companyId,
            status: 'DRAFT',
          },
          select: {
            id: true,
            name: true,
            completedOn: true,
            orderedDelivery: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        })

        if (template.completedOn) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'E-signing has already completed among all parties.',
          })
        }

        await tx.templateField.deleteMany({
          where: {
            templateId: template.id,
          },
        })

        const recipientIdList = input.data.map((item) => item.recipientId)
        const recipientList = await tx.esignRecipient.findMany({
          where: {
            templateId: template.id,
            id: {
              in: recipientIdList,
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })

        const fieldsList = []

        for (const field of input.data) {
          if (field) {
            fieldsList.push({ ...field, templateId: template.id })
          }
        }

        await tx.templateField.createMany({
          data: fieldsList,
        })

        await tx.template.update({
          where: {
            id: template.id,
          },
          data: {
            status: input.status,
            message: input.message,
          },
        })

        if (input.status === 'COMPLETE') {
          const nonDeletableRecipientIdList = recipientList.map(
            (item) => item.id,
          )
          await tx.esignRecipient.deleteMany({
            where: {
              templateId: template.id,
              id: {
                notIn: nonDeletableRecipientIdList,
              },
            },
          })

          for (const recipient of recipientList) {
            if (!recipient) {
              throw new Error('not found')
            }

            const token = await EncodeEmailToken({
              recipientId: recipient.id,
              templateId: template.id,
            })

            const email = recipient.email

            mails.push({
              token,
              email,
              recipient: {
                id: recipient.id,
                name: recipient?.name,
                email: recipient.email,
              },
              sender: {
                name: user.name,
                email: user.email,
              },
              message: input?.message,
              documentName: template.name,
              company: {
                name: template.company.name,
                logo: template.company.logo,
              },
            })

            if (template.orderedDelivery) {
              break
            }
          }
        }
      })

      if (mails.length) {
        if (triggerClient) {
          await triggerClient.sendEvents(
            mails.map((payload) => ({
              name: 'email.esign',
              payload,
            })),
          )
        } else {
          await Promise.all(mails.map((payload) => sendEsignEmail(payload)))
          await ctx.db.$transaction(
            mails.map((payload) =>
              ctx.db.esignRecipient.update({
                where: {
                  id: payload.recipient.id,
                },
                data: { status: 'SENT' },
              }),
            ),
          )
        }
      }

      return {
        success: true,
        title:
          input.status === 'COMPLETE' ? 'Sent for e-sign' : 'Saved in draft',
        message:
          input.status === 'COMPLETE'
            ? 'Successfully sent document for e-signature.'
            : 'Your template fields has been created.',
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        return {
          success: false,
          title: 'Bad request',
          message: error.message,
        }
      } else {
        return {
          success: false,
          title: 'Error',
          message: 'Uh ohh! Something went wrong. Please try again later.',
        }
      }
    }
  })
