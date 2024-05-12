import { checkMembership } from '@/server/auth'
import { createTRPCRouter, withAuth } from '@/trpc/api/trpc'
import { ZodOnboardingMutationSchema } from '../onboarding-router/schema'
import { ZodSwitchCompanyMutationSchema } from './schema'

export const companyRouter = createTRPCRouter({
  getCompany: withAuth.query(async ({ ctx }) => {
    const user = ctx.session.user
    const companyId = user.companyId

    const company = await ctx.db.member.findFirstOrThrow({
      where: {
        id: user.memberId,
        companyId,
      },
      select: {
        id: true,
        title: true,
        company: {
          select: {
            id: true,
            publicId: true,
            name: true,
            website: true,
            incorporationDate: true,
            incorporationType: true,
            incorporationState: true,
            incorporationCountry: true,
            state: true,
            city: true,
            zipcode: true,
            streetAddress: true,
            logo: true,
          },
        },
      },
    })
    return company
  }),
  switchCompany: withAuth
    .input(ZodSwitchCompanyMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx

      await db.$transaction(async (tx) => {
        const { memberId } = await checkMembership({
          session: {
            ...session,
            user: { ...session.user, memberId: input.id },
          },
          tx,
        })

        await tx.member.update({
          where: {
            id: memberId,
          },
          data: {
            lastAccessed: new Date(),
          },
        })
      })

      return { success: true }
    }),
  updateCompany: withAuth
    .input(ZodOnboardingMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.$transaction(async (tx) => {
          const { companyId } = await checkMembership({
            tx,
            session: ctx.session,
          })

          const { company } = input
          const { incorporationDate, ...rest } = company

          await tx.company.update({
            where: {
              id: companyId,
            },
            data: {
              incorporationDate: new Date(incorporationDate),
              ...rest,
            },
          })
        })

        return {
          success: true,
          message: 'successfully updated company',
        }
      } catch (error) {
        console.error('Error onboarding:', error)
        return {
          success: false,
          message:
            'Oops, something went wrong while onboarding. Please try again.',
        }
      }
    }),
})
