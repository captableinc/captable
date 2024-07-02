import { ProxyPrismaModel } from "@/server/api/pagination/prisma-proxy";
import type { PrismaClient } from "@prisma/client";

export type PrismaTransactionalClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

type Payload = {
  companyId: string;
  limit: number;
  cursor: string | null;
};

type GetPaginatedStakeholders = {
  db: PrismaTransactionalClient;
  payload: Payload;
};

export const getPaginatedStakeholders = async ({
  db,
  payload,
}: GetPaginatedStakeholders) => {
  // companyId: "clwuwr0zl0004x8glra7ztbsv",
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
  };

  //@ts-ignore
  const prismaModel = ProxyPrismaModel(db.stakeholder);

  const { data, count, total, cursor } = await prismaModel.findManyPaginated(
    queryCriteria,
    paginationData,
  );

  return {
    data: data,
    meta: {
      count,
      total,
      cursor,
    },
  };
};
