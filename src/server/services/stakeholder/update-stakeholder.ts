import { Audit } from "@/server/audit";
import type { UpdateStakeholderMutationType } from "@/trpc/routers/stakeholder-router/schema";
import type { PrismaClient } from "@prisma/client";

export type UpdateStakeholderOptions = {
  db: PrismaClient;
  payload: {
    stakeholderId: string;
    companyId: string;
    requestIp: string;
    userAgent: string;
    user: {
      id: string;
      name: string;
    };
    data: Omit<UpdateStakeholderMutationType, "id">;
  };
};

export const updateStakeholder = async ({
  db,
  payload,
}: UpdateStakeholderOptions) => {
  const { requestIp, userAgent, user, data } = payload;

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
  return updatedStakeholder;
};
