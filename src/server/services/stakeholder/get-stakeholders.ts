import { ProxyPrismaModel } from "@/server/api/pagination/prisma-proxy";
import type { PrismaClient } from "@prisma/client";

type GetPaginatedStakeholders = {
  db: PrismaClient;
  payload: {
    companyId: string;
    limit: number;
    cursor?: string;
  };
};

export const getPaginatedStakeholders = async ({
  db,
  payload,
}: GetPaginatedStakeholders) => {
  const queryCriteria = {
    where: {
      companyId: payload.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  const { limit, cursor: _cursor } = payload;

  const paginationData = {
    limit,
    cursor: _cursor,
  };

  const prismaModel = ProxyPrismaModel(db.stakeholder);

  const { data, count, total, cursor } = await prismaModel.findManyPaginated(
    queryCriteria,
    paginationData,
  );

  return {
    data,
    meta: {
      count,
      total,
      cursor,
    },
  };
};
