import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { db, desc, eq, equityPlans } from "@captable/db";
import { EquityPlanMutationSchema } from "./schema";

export const equityPlanRouter = createTRPCRouter({
  getPlans: withAuth.query(async ({ ctx }) => {
    const { session } = ctx;

    const data = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const data = await tx
        .select()
        .from(equityPlans)
        .where(eq(equityPlans.companyId, companyId))
        .orderBy(desc(equityPlans.createdAt));

      return data;
    });

    return { data };
  }),

  create: withAuth
    .input(EquityPlanMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp, session } = ctx;

      try {
        await db.transaction(async (tx) => {
          const { companyId } = await checkMembership({ session, tx });

          await tx.insert(equityPlans).values({
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
            updatedAt: new Date(),
          });

          await Audit.create(
            {
              action: "equityPlan.created",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                requestIp: requestIp || "",
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

        await db.transaction(async (tx) => {
          const { companyId } = await checkMembership({ tx, session });

          if (!input.id) {
            throw new Error("Equity plan ID is required for update");
          }

          await tx
            .update(equityPlans)
            .set({
              name: input.name,
              planEffectiveDate: input.planEffectiveDate
                ? new Date(input.planEffectiveDate)
                : null,
              boardApprovalDate: new Date(input.boardApprovalDate),
              initialSharesReserved: input.initialSharesReserved,
              shareClassId: input.shareClassId,
              comments: input.comments,
              defaultCancellatonBehavior: input.defaultCancellatonBehavior,
              updatedAt: new Date(),
            })
            .where(eq(equityPlans.id, input.id));

          await Audit.create(
            {
              action: "equityPlan.updated",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                requestIp: requestIp || "",
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
