import { db } from "./db";

export const getMembers = (companyId: string) => {
  return db.membership.findMany({
    where: {
      companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

export type TypeGetMembers = Awaited<ReturnType<typeof getMembers>>;
