import { checkMembership } from '@/server/auth'
import { withAuth } from '@/trpc/api/trpc'
import { ZodAllEsignAuditsQuerySchema } from '../schema'

export const allEsignAuditsProcedure = withAuth
  .input(ZodAllEsignAuditsQuerySchema)
  .query(async ({ ctx, input }) => {
    const { db, session } = ctx
    const { templatePublicId } = input

    const { audits } = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx })

      const { id: templateId } = await tx.template.findFirstOrThrow({
        where: {
          publicId: templatePublicId,
        },
        select: {
          id: true,
        },
      })

      const audits = await tx.esignAudit.findMany({
        where: {
          companyId,
          templateId,
        },
      })

      return { audits }
    })

    return { audits }
  })
