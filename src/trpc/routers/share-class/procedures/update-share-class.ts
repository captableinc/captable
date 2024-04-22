import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { ShareClassMutationSchema } from "../schema";

export const updateShareClassProcedure = withAuth
  .input(ShareClassMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp } = ctx;

    try {
      const companyId = ctx.session.user.companyId;
      const prefix = input.classType === "COMMON" ? "CS" : "PS";

      await ctx.db.$transaction(async (tx) => {
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
          data: {
            ...data,
            prefix: input.classType === "COMMON" ? "CS" : "PS",
          },
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
  });
