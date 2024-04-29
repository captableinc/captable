import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { EquityPlanMutationSchema } from "./schema";

export const equityPlanRouter = createTRPCRouter({
  getPlans: withAuth.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const data = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const data = await tx.equityPlan.findMany({
        where: {
          companyId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return data;
    });

    return { data };
  }),

  create: withAuth
    .input(EquityPlanMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp, session } = ctx;

      try {
        await ctx.db.$transaction(async (tx) => {
          const { companyId } = await checkMembership({ session, tx });

          const data = {
            companyId,
            name: input.name,
            planEffectiveDate: input.planEffectiveDate
              ? new Date(input.planEffectiveDate)
              : null,
            boardApprovalDate: new Date(input.boardApprovalDate),
            initialSharesReserved: input.initialSharesReserved,
            shareClassId: input.shareClassId,
            comments: input.comments,
            defaultCancellatonBehavior: input.defaultCancellatonBehavior,
          };

          await tx.equityPlan.create({ data });
          await Audit.create(
            {
              action: "equityPlan.created",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                requestIp,
                userAgent,
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} created an equity plan - ${input.name}`,
            },
            tx,
          );
        });

        return { success: true, message: "Equity plan created successfully." };
      } catch (error) {
        console.error("Error creating an equity plan:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),

  update: withAuth
    .input(EquityPlanMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { userAgent, requestIp, session } = ctx;

        await ctx.db.$transaction(async (tx) => {
          const { companyId } = await checkMembership({ tx, session });

          const data = {
            name: input.name,
            planEffectiveDate: input.planEffectiveDate
              ? new Date(input.planEffectiveDate)
              : null,
            boardApprovalDate: new Date(input.boardApprovalDate),
            initialSharesReserved: input.initialSharesReserved,
            shareClassId: input.shareClassId,
            comments: input.comments,
            defaultCancellatonBehavior: input.defaultCancellatonBehavior,
          };

          await tx.equityPlan.update({
            where: { id: input.id },
            data,
          });

          await Audit.create(
            {
              action: "equityPlan.updated",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                requestIp,
                userAgent,
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} updated an equity plan - ${input.name}`,
            },
            tx,
          );
        });

        return { success: true, message: "Equity plan updated successfully." };
      } catch (error) {
        console.error("Error updating an equity plan:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),
});
