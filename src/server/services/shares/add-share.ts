import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import type { TypeZodAddShareMutationSchema } from "@/trpc/routers/securities-router/schema";

export interface AddShareType extends TypeZodAddShareMutationSchema {
  companyId: string;
  memberId: string;
  requestIP: string;
  userAgent: string;
  user: {
    id: string;
    name: string;
  };
}

export const addShare = async (input: AddShareType) => {
  try {
    const share = await db.$transaction(async (tx) => {
      const documents = input.documents;

      const data = {
        companyId: input.companyId,
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
        vestingSchedule: input.vestingSchedule,
        companyLegends: input.companyLegends,
        issueDate: new Date(input.issueDate),
        rule144Date: new Date(input.rule144Date),
        vestingStartDate: new Date(input.vestingStartDate),
        boardApprovalDate: new Date(input.boardApprovalDate),
      };

      const share = await tx.share.create({ data });

      if (documents && documents.length > 0) {
        const bulkDocuments = documents.map((doc) => ({
          companyId: input.companyId,
          uploaderId: input.memberId,
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
          action: "share.created",
          companyId: input.companyId,
          actor: { type: "user", id: input.user.id },
          context: {
            userAgent: input.userAgent,
            requestIp: input.requestIP,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${input.user.name} added share for stakeholder ${input.stakeholderId}`,
        },
        tx,
      );

      return share;
    });

    return {
      success: true,
      message: "🎉 Successfully added a share",
      data: share,
    };
  } catch (error) {
    console.error("Error adding shares: ", error);
    return {
      success: false,
      message: "Please use unique Certificate Id.",
    };
  }
};
