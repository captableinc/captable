import type { TAddStakeholderSchema } from "@/server/api/schema/stakeholder";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";

type AddStakeholderOptions = {
  companyId: string;
  requestIp: string;
  userAgent: string;
  user: {
    id: string;
    name: string;
  };
  data: TAddStakeholderSchema;
};

export const addStakeholders = async (payload: AddStakeholderOptions) => {
  const { companyId, requestIp, userAgent, user, data } = payload;

  const stakeholders = await db.$transaction(async (tx) => {
    const inputDataWithCompanyId = data.map((stakeholder) => ({
      ...stakeholder,
      companyId,
    }));

    const addedStakeholders = await tx.stakeholder.createManyAndReturn({
      data: inputDataWithCompanyId,
    });

    const auditPromises = addedStakeholders.map((stakeholder) =>
      Audit.create(
        {
          action: "stakeholder.added",
          companyId: companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "stakeholder", id: stakeholder.id }],
          summary: `${user.name} added the stakholder in the company : ${stakeholder.name}`,
        },
        tx,
      ),
    );

    await Promise.all(auditPromises);
    return addedStakeholders;
  });

  return stakeholders;
};
