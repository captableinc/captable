import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodUpdateShareMutationSchema } from "../schema";

export const updateShareProcedure = withAuth
  .input(ZodUpdateShareMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp } = ctx;

    try {
      const user = ctx.session.user;
      const documents = input.documents;

      await ctx.db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({
          session: ctx.session,
          tx,
        });

        const data = {
          stakeholderId: input.stakeholderId,
          shareClassId: input.shareClassId,
          status: input.status,
          certificateId: input.certificateId,
          quantity: input.quantity,
          pricePerShare: input.pricePerShare,
          capitalContribution: input.capitalContribution,
          ipContribution: input.ipContribution,
          debtCancelled: input.debtCancelled,
          otherContributions: input.otherContributions,
          cliffYears: input.cliffYears,
          vestingYears: input.vestingYears,
          companyLegends: input.companyLegends,
          issueDate: new Date(input.issueDate),
          rule144Date: new Date(input.rule144Date),
          vestingStartDate: new Date(input.vestingStartDate),
          boardApprovalDate: new Date(input.boardApprovalDate),
        };

        const share = await tx.share.update({
          where: {
            id: input.id,
            companyId,
          },
          data,
          select: { id: true },
        });

        // Only attach newly uploaded documents; existing ones are left untouched.
        if (documents.length) {
          const bulkDocuments = documents.map((doc) => ({
            companyId,
            uploaderId: user.memberId,
            publicId: generatePublicId(),
            name: doc.name,
            bucketId: doc.bucketId,
            shareId: share.id,
          }));

          await tx.document.createMany({
            data: bulkDocuments,
            skipDuplicates: true,
          });
        }

        await Audit.create(
          {
            action: "share.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "share", id: share.id }],
            summary: `${user.name} updated share for stakeholder ${input.stakeholderId}`,
          },
          tx,
        );
      });

      return {
        success: true,
        message: "🎉 Successfully updated the share",
      };
    } catch (error) {
      console.error("Error updating share: ", error);
      return {
        success: false,
        message:
          "Failed to update the share. Please use a unique Certificate Id.",
      };
    }
  });
