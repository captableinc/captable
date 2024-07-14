import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { ZodOnboardingMutationSchema } from "../onboarding-router/schema";
import { ZodSwitchCompanyMutationSchema } from "./schema";

export const companyRouter = createTRPCRouter({
  getCompany: withAuth.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const companyId = user.companyId;

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
            country: true,
            logo: true,
          },
        },
      },
    });
    return company;
  }),
  switchCompany: withAuth
    .input(ZodSwitchCompanyMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session, userAgent, requestIp } = ctx;

      await db.$transaction(async (tx) => {
        const member = await tx.member.findFirst({
          where: {
            id: input.id,
            isOnboarded: true,
          },
        });

        if (!member) {
          return { success: true };
        }

        await tx.member.update({
          where: {
            id: member.id,
          },
          data: {
            lastAccessed: new Date(),
          },
        });
        const { user } = session;
        await Audit.create(
          {
            action: "company.lastAcessed",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "company", id: user.companyId }],
            summary: `${user.name} lastly accessed the company ${user.companyId}`,
          },
          tx,
        );
      });

      return { success: true };
    }),
  updateCompany: withAuth
    .input(ZodOnboardingMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.$transaction(async (tx) => {
          const { companyId } = await checkMembership({
            tx,
            session: ctx.session,
          });

          const { company } = input;
          const { incorporationDate, ...rest } = company;
          const { requestIp, userAgent, session } = ctx;
          const { user } = session;

          await tx.company.update({
            where: {
              id: companyId,
            },
            data: {
              incorporationDate: new Date(incorporationDate),
              ...rest,
            },
          });

          await Audit.create(
            {
              action: "company.updated",
              companyId: user.companyId,
              actor: { type: "user", id: user.id },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "company", id: user.companyId }],
              summary: `${user.name} updated the company ${company.name}`,
            },
            tx,
          );
        });

        return {
          success: true,
          message: "successfully updated company",
        };
      } catch (error) {
        console.error("Error onboarding:", error);
        return {
          success: false,
          message:
            "Oops, something went wrong while onboarding. Please try again.",
        };
      }
    }),
});
