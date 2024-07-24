import { ProxyPrismaModel } from "@/server/api/pagination/prisma-proxy";
import { db } from "@/server/db";

type GetPaginatedStakeholders = {
  companyId: string;
  take: number;
  cursor?: string;
};

export const getPaginatedStakeholders = async (
  payload: GetPaginatedStakeholders,
) => {
  const queryCriteria = {
    where: {
      companyId: payload.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  const { take, cursor: _cursor } = payload;

  const paginationData = {
    take,
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
