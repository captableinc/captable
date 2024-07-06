import type { PrismaClient } from "@prisma/client";

type GetStakeholderById = {
  db: PrismaClient;
  stakeholderId: string;
};

export const getStakeholderById = async ({
  db,
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
