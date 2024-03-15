import { Audit } from "@/server/audit";
import { EquityPlanMutationSchema } from "./schema";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

export const equityPlanRouter = createTRPCRouter({
  getPlans: withAuth.query(async ({ ctx }) => {
    const {
      db,
      session: { user },
    } = ctx;

    const data = await db.equityPlan.findMany({
      where: {
        companyId: user.companyId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return { data };
  }),

  create: withAuth
    .input(EquityPlanMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;
      console.log("adding user and name inside securities fields");
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
        const { userAgent, requestIp } = ctx;
        const companyId = ctx.session.user.companyId;

        await ctx.db.$transaction(async (tx) => {
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
