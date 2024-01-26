import { db } from "./db";

export const getCompanyList = async (userId: string) => {
  const data = await db.membership.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      company: {
        select: {
          id: true,
          publicId: true,
          name: true,
        },
      },
    },
  });

  return data;
};

export type TGetCompanyList = Awaited<ReturnType<typeof getCompanyList>>;
