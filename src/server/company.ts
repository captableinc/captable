import { db } from "./db";

export const getCompanyList = async (userId: string) => {
  const data = await db.member.findMany({
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

export const getCompany = async (userId: string, companyId: string) => {
  const member = await db.member.findFirst({
    where: {
      userId,
      companyId,
    },
    select: {
      id: true,
      company: {
        select: {
          id: true,
          publicId: true,
          name: true,
          incorporationDate: true,
          incorporationType: true,
          incorporationState: true,
          incorporationCountry: true,
          state: true,
          city: true,
          zipcode: true,
          streetAddress: true,
        },
      },
    },
  });

  return member;
};

export type TGetCompanyList = Awaited<ReturnType<typeof getCompanyList>>;
export type TGetCompany = Awaited<ReturnType<typeof getCompany>>;
