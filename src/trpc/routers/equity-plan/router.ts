import { Audit } from "@/server/audit";
import { EquityPlanMutationSchema } from "./schema";
import { createTRPCRouter, adminOnlyProcedure } from "@/trpc/api/trpc";

export const equityPlanRouter = createTRPCRouter({
  create: adminOnlyProcedure
    .input(EquityPlanMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;

      try {
        const companyId = ctx.session.user.companyId;

        await ctx.db.$transaction(async (tx) => {
          const data = {
            companyId,
            name: input.name,
            planEffectiveDate: input.planEffectiveDate
              ? new Date(input.planEffectiveDate)
              : null,
            boardApprovalDate: new Date(input.boardApprovalDate),
            initialSharesReserved: input.initialSharesReserved,
            shareClassId: input.shareClassId,
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
});
