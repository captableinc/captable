import { withAccessControl } from "@/trpc/api/trpc";
import { companies, db, desc, eq, stakeholders } from "@captable/db";

export const getStakeholdersProcedure = withAccessControl
  .meta({ policies: { stakeholder: { allow: ["read"] } } })
  .query(async ({ ctx }) => {
    const { membership } = ctx;
    const data = await db
      .select({
        id: stakeholders.id,
        name: stakeholders.name,
        email: stakeholders.email,
        institutionName: stakeholders.institutionName,
        stakeholderType: stakeholders.stakeholderType,
        currentRelationship: stakeholders.currentRelationship,
        taxId: stakeholders.taxId,
        streetAddress: stakeholders.streetAddress,
        city: stakeholders.city,
        state: stakeholders.state,
        zipcode: stakeholders.zipcode,
        companyId: stakeholders.companyId,
        createdAt: stakeholders.createdAt,
        updatedAt: stakeholders.updatedAt,
        company: {
          name: companies.name,
        },
      })
      .from(stakeholders)
      .leftJoin(companies, eq(stakeholders.companyId, companies.id))
      .where(eq(stakeholders.companyId, membership.companyId))
      .orderBy(desc(stakeholders.createdAt));

    return data;
  });
