import { companies, db, eq, members } from "@captable/db";

export const getCompanyList = async (userId: string) => {
  const data = await db
    .select({
      id: members.id,
      company: {
        id: companies.id,
        publicId: companies.publicId,
        name: companies.name,
      },
    })
    .from(members)
    .innerJoin(companies, eq(members.companyId, companies.id))
    .where(eq(members.userId, userId));

  return data;
};

export type TGetCompanyList = Awaited<ReturnType<typeof getCompanyList>>;
