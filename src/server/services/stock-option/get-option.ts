import { ProxyPrismaModel } from "@/server/api/pagination/prisma-proxy";
import { db } from "@/server/db";

type GetPaginatedOptions = {
  companyId: string;
  take: number;
  cursor?: string;
  total?: number;
};

export const getPaginatedOptions = async (payload: GetPaginatedOptions) => {
  const queryCriteria = {
    where: {
      companyId: payload.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  const paginationData = {
    take: payload.take,
    cursor: payload.cursor,
    total: payload.total,
  };

  const prismaModel = ProxyPrismaModel(db.option);

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
