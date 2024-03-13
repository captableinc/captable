import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { ZodOnboardingMutationSchema } from "../onboarding-router/schema";
import { ZodSwitchCompanyMutationSchema } from "./schema";

export const companyRouter = createTRPCRouter({
  getCompany: withAuth.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const userId = user.id;
    const companyId = user.companyId;

    const company = await ctx.db.member.findFirstOrThrow({
      where: {
        userId,
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
            incorporationDate: true,
            incorporationType: true,
            incorporationState: true,
            incorporationCountry: true,
            state: true,
            city: true,
            zipcode: true,
            streetAddress: true,
          },
        },
      },
    });
    return company;
  }),
  switchCompany: withAuth
    .input(ZodSwitchCompanyMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.member.update({
        where: {
          id: input.id,
        },
        data: {
          lastAccessed: new Date(),
        },
      });
      return { success: true };
    }),
  updateCompany: withAuth
    .input(ZodOnboardingMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const memberAuthorized = await ctx.db.member.findFirst({
          select: {
            company: {
              select: {
                id: true,
              },
            },
          },
          where: {
            userId: ctx.session.user.id,
            companyId: ctx.session.user.companyId,
          },
        });

        if (!memberAuthorized) {
          return {
            success: false,
            message: "You are not authorized to perform this action",
          };
        }

        const { company } = input;
        const { incorporationDate, ...rest } = company;

        await ctx.db.company.update({
          where: {
            id: memberAuthorized.company.id,
          },
          data: {
            incorporationDate: new Date(incorporationDate),
            ...rest,
          },
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
