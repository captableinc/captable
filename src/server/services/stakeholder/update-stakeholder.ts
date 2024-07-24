import type { TUpdateStakeholderSchema } from "@/server/api/schema/stakeholder";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";

export type UpdateStakeholderPayloadType = {
  stakeholderId: string;
  companyId: string;
  requestIp: string;
  userAgent: string;
  user: {
    id: string;
    name: string;
  };
  data: TUpdateStakeholderSchema;
};

export const updateStakeholder = async (
  payload: UpdateStakeholderPayloadType,
) => {
  const { requestIp, userAgent, user } = payload;
  const data = payload.data;

  const { updatedStakeholder } = await db.$transaction(async (tx) => {
    const updatedStakeholder = await db.stakeholder.update({
      where: {
        id: payload.stakeholderId,
        companyId: payload.companyId,
      },
      data,
    });
    await Audit.create(
      {
        action: "stakeholder.updated",
        companyId: payload.companyId,
        actor: { type: "user", id: user.id },
        context: {
          requestIp,
          userAgent,
        },
        target: [{ type: "stakeholder", id: updatedStakeholder.id }],
        summary: `${user.name} updated the stakholder details in the company : ${updatedStakeholder.name}`,
      },
      tx,
    );
    return { updatedStakeholder };
  });
  return { updatedStakeholder };
};
