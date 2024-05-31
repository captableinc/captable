import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { ShareClassMutationSchema } from "./schema";

import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";

export const shareClassRouter = createTRPCRouter({
  create: withAuth
    .input(ShareClassMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;

      try {
        const prefix = (input.classType === "COMMON" ? "CS" : "PS") as
          | "CS"
          | "PS";

        await ctx.db.$transaction(async (tx) => {
          const { companyId } = await checkMembership({
            tx,
            session: ctx.session,
          });

          const maxIdx = await tx.shareClass.count({
            where: {
              companyId,
            },
          });

          const idx = maxIdx + 1;
          const data = {
            idx,
            prefix,
            companyId,
            name: input.name,
            classType: input.classType,
            initialSharesAuthorized: input.initialSharesAuthorized,
            boardApprovalDate: new Date(input.boardApprovalDate),
            stockholderApprovalDate: new Date(input.stockholderApprovalDate),
            votesPerShare: input.votesPerShare,
            parValue: input.parValue,
            pricePerShare: input.pricePerShare,
            seniority: input.seniority,
            conversionRights: input.conversionRights,
            convertsToShareClassId: input.convertsToShareClassId,
            liquidationPreferenceMultiple: input.liquidationPreferenceMultiple,
            participationCapMultiple: input.participationCapMultiple,
          };

          await tx.shareClass.create({ data });

          await Audit.create(
            {
              action: "shareClass.created",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} created a share class - ${input.name}`,
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

  update: withAuth
    .input(ShareClassMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { userAgent, requestIp } = ctx;

      try {
        const prefix = (input.classType === "COMMON" ? "CS" : "PS") as
          | "CS"
          | "PS";

        await ctx.db.$transaction(async (tx) => {
          const { companyId } = await checkMembership({
            tx,
            session: ctx.session,
          });

          const data = {
            prefix,
            name: input.name,
            classType: input.classType,
            initialSharesAuthorized: input.initialSharesAuthorized,
            boardApprovalDate: new Date(input.boardApprovalDate),
            stockholderApprovalDate: new Date(input.stockholderApprovalDate),
            votesPerShare: input.votesPerShare,
            parValue: input.parValue,
            pricePerShare: input.pricePerShare,
            seniority: input.seniority,
            conversionRights: input.conversionRights,
            convertsToShareClassId: input.convertsToShareClassId,
            liquidationPreferenceMultiple: input.liquidationPreferenceMultiple,
            participationCapMultiple: input.participationCapMultiple,
          };

          await tx.shareClass.update({
            where: { id: input.id },
            data,
          });

          await Audit.create(
            {
              action: "shareClass.updated",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} updated a share class - ${input.name}`,
            },
            tx,
          );
        });

        return { success: true, message: "Share class updated successfully." };
      } catch (error) {
        console.error("Error updating shareClass:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),

  get: withAuth.query(async ({ ctx: { db, session } }) => {
    const shareClass = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      return await tx.shareClass.findMany({
        where: {
          companyId,
        },
        select: {
          id: true,
          name: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      });
    });
    return shareClass;
  }),
});
