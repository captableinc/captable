import { ProxyPrismaModel } from "@/server/api/pagination/prisma-proxy";
import { db } from "@/server/db";
import type { GetPaginatedShares } from "../shares/get-shares";

type GetPaginatedMembers = GetPaginatedShares;

export const getPaginatedMembers = async (payload: GetPaginatedMembers) => {
  const queryCriteria = {
    where: {
      companyId: payload.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  console.log("Payload take is : ", payload.take);

  const paginationData = {
    take: payload.take,
    cursor: payload.cursor,
    total: payload.total,
  };

  const prismaModel = ProxyPrismaModel(db.member);

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
