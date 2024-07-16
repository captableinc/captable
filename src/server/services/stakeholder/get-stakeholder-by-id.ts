import { db } from "@/server/db";

type GetStakeholderById = {
  stakeholderId: string;
};

export const getStakeholderById = async ({
  stakeholderId,
}: GetStakeholderById) => {
  return await db.stakeholder.findUniqueOrThrow({
    where: {
      id: stakeholderId,
    },
    include: {
      company: {
        select: {
          name: true,
        },
      },
    },
  });
};
