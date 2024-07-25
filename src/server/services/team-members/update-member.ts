import type { UpdateMemberType } from "@/server/api/schema/team-member";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import type { UpdateSharePayloadType } from "../shares/update-share";

export interface UpdateMemberPayloadType
  extends Omit<UpdateSharePayloadType, "shareId" | "data"> {
  data: UpdateMemberType;
  memberId: string;
}

export const updateMember = async (payload: UpdateMemberPayloadType) => {
  const { companyId, data, memberId, requestIp, user, userAgent } = payload;

  try {
    const existingMember = await db.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!existingMember) {
      return {
        code: "BAD_REQUEST",
        success: false,
        message: `Member with the ID ${memberId} not be found`,
        data: null,
      };
    }

    const memberData = { ...existingMember, ...data };

    const { member, success, message } = await db.$transaction(async (tx) => {
      const member = await tx.member.update({
        where: {
          id: memberData.id,
        },
        //@ts-ignore
        data: memberData,
      });

      await Audit.create(
        {
          action: "member.updated",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "user", id: member.userId }],
          summary: `${user.name} updated ${user.name} details`,
        },
        tx,
      );

      return {
        message: "Successfully updated Member details !",
        success: true,
        member,
      };
    });

    return { message, success, data: member, code: "SUCCESS" };
  } catch (error) {
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, please try again or contact support",
      data: null,
    };
  }
};
