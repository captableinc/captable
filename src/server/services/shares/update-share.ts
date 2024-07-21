import { ApiError } from "@/server/api/error";
import type { UpdateShareSchemaType } from "@/server/api/schema/shares";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";

export type UpdateSharePayloadType = {
  shareId: string;
  companyId: string;
  requestIp: string;
  userAgent: string;
  user: {
    id: string;
    name: string;
  };
  data: UpdateShareSchemaType;
};

export const updateShare = async (payload: UpdateSharePayloadType) => {
  const { shareId, companyId, requestIp, userAgent, user, data } = payload;

  try {
    const existingShare = await db.share.findUnique({
      where: { id: shareId },
    });

    if (!existingShare) {
      return {
        success: false,
        message: `Share with ID ${shareId} not be found`,
      };
    }

    console.log({ data });
    const share = await db.$transaction(async (tx) => {
      const share = await tx.share.update({
        where: { id: shareId },
        data,
      });

      await Audit.create(
        {
          action: "share.updated",
          companyId: companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent: userAgent,
            requestIp: requestIp,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${user.name} updated share the share ID ${shareId}`,
        },
        tx,
      );

      return share;
    });

    return {
      success: true,
      message: "🎉 Successfully updated share.",
      data: share,
    };
  } catch (error) {
    console.error("updateShare", error);
    throw new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, please try again or contact support",
    });
  }
};
