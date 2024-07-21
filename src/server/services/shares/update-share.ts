import { ApiError } from "@/server/api/error";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import type { AddShareType } from "./add-share";

interface UpdateShareType extends AddShareType {
  shareId: string;
}

export const updateShare = async (input: UpdateShareType) => {
  try {
    const existingShare = await db.share.findUnique({
      where: {
        id: input.shareId,
      },
    });

    if (!existingShare) {
      return {
        success: false,
        message: "Enter Valid Share ID",
      };
    }

    await db.$transaction(async (tx) => {
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

      const share = await tx.share.update({
        where: { id: input.shareId },
        data,
      });

      await Audit.create(
        {
          action: "share.updated",
          companyId: input.companyId,
          actor: { type: "user", id: input.user.id },
          context: {
            userAgent: input.userAgent,
            requestIp: input.requestIP,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${input.user.name} updated share for stakeholder ${input.stakeholderId}`,
        },
        tx,
      );
    });

    return {
      success: true,
      message: "🎉 Successfully Updated the share",
    };
  } catch (error) {
    console.error("updateShare", error);
    throw new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, please try again or contact support",
    });
  }
};
