import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodAddShareMutationSchema } from "../schema";

export const addShareProcedure = withAuth
  .input(ZodAddShareMutationSchema)
  .mutation(async ({ ctx, input }) => {
    console.log({ input }, "#############");

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
          companyId,
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
        const share = await tx.share.create({ data });

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

        await Audit.create(
          {
            action: "share.created",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "share", id: share.id }],
            summary: `${user.name} added share for stakeholder ${input.stakeholderId}`,
          },
          tx,
        );
      });

      return {
        success: true,
        message: "🎉 Successfully added a share",
      };
    } catch (error) {
      console.error("Error adding shares: ", error);
      return {
        success: false,
        message: "Please use unique Certificate Id.",
      };
    }
  });
