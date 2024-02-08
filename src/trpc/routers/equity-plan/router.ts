import { createTRPCRouter, adminOnlyProcedure } from "@/trpc/api/trpc";
import { EquityPlanMutationSchema } from "./schema";

import { Audit } from "@/server/audit";

export const equityPlanRouter = createTRPCRouter({
  create: adminOnlyProcedure
    .input(EquityPlanMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const companyId = ctx.session.user.companyId;

        const equityPlan = await ctx.db.$transaction(async (tx) => {
          const data = {
            companyId,
            name: input.name,
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
              context: {},
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} created an equity plan - ${input.name}`,
            },
            tx,
          );
        });

        return { success: true, message: "Share class created successfully." };
      } catch (error) {
        console.error("Error creating shareClass:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),
});
