import { ProxyPrismaModel } from "@/server/api/pagination/prisma-proxy";
import { db } from "@/server/db";

type GetPaginatedShares = {
  companyId: string;
  limit: number;
  cursor?: string;
  total?: number;
};

export const getPaginatedShares = async (payload: GetPaginatedShares) => {
  const queryCriteria = {
    where: {
      companyId: payload.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  const paginationData = {
    limit: payload.limit,
    cursor: payload.cursor,
    total: payload.total,
  };

  const prismaModel = ProxyPrismaModel(db.share);

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
