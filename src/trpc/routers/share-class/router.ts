import { createTRPCRouter, adminOnlyProcedure } from "@/trpc/api/trpc";
import { ShareClassMutationSchema } from "./schema";

import { Audit } from "@/server/audit";

export const shareClassRouter = createTRPCRouter({
  create: adminOnlyProcedure
    .input(ShareClassMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const companyId = ctx.session.user.companyId;
        const prefix = (input.classType === "common" ? "CS" : "PS") as
          | "CS"
          | "PS";

        const shareClass = await ctx.db.$transaction(async (tx) => {
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

          const sc = await tx.shareClass.create({ data });
          const audit = await Audit.create(
            {
              action: "shareClass.created",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {},
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} created a share class - (${prefix}-${idx}) ${input.name}`,
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
