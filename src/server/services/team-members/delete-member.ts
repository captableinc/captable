import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import type { UpdateMemberPayloadType } from "./update-member";

export interface DeleteMemberPayload
  extends Omit<UpdateMemberPayloadType, "data" | ""> {}

export const deleteMember = async (payload: DeleteMemberPayload) => {
  const { companyId, memberId, requestIp, userAgent, user } = payload;

  const existingMember = await db.member.findUnique({
    where: {
      id: memberId,
      companyId,
    },
  });

  if (!existingMember) {
    return {
      success: false,
      message: `Member with the ID ${memberId} not be found`,
      data: null,
    };
  }

  const member = await db.member.delete({
    where: {
      id: existingMember.id,
    },
    include: {
      user: true,
      company: true,
    },
  });

  await Audit.create(
    {
      action: "member.removed",
      companyId,
      actor: { type: "user", id: user.id },
      context: {
        requestIp,
        userAgent,
      },
      target: [{ type: "user", id: member.userId }],
      summary: `${user.name} removed ${member.user?.name} from ${member?.company?.name}`,
    },
    db,
  );

  return { success: true, message: "Member removed successfully !" };
};
