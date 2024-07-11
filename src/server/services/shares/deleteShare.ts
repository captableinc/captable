import { Audit } from "@/server/audit";
import { db } from "@/server/db";

interface DeleteShareType {
  user: {
    id: string;
    name: string;
  };
  shareId: string;
  companyId: string;
  userAgent: string;
  requestIp: string;
}

export const deleteShare = async ({
  shareId,
  companyId,
  requestIp,
  userAgent,
  user,
}: DeleteShareType) => {
  try {
    const existingShare = await db.share.findUnique({
      where: {
        id: shareId,
      },
    });

    if (!existingShare) {
      return {
        success: false,
        message: "Enter Valid Share ID",
      };
    }

    const share = await db.$transaction(async (tx) => {
      const share = await tx.share.delete({
        where: {
          id: shareId,
        },
      });

      const { stakeholderId } = share;

      await Audit.create(
        {
          action: "share.deleted",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "share", id: shareId }],
          summary: `${user.name} Deleted the share for stakeholder ${stakeholderId}`,
        },
        tx,
      );

      return share;
    });

    return {
      success: true,
      message: "🎉 Successfully Deleted the share",
      share,
    };
  } catch (error) {
    console.error("Error Deleting the share: ", error);
    return {
      success: false,
      message: "Can't Delete the Share now. Please try again later",
    };
  }
};
