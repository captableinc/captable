import { checkMembership } from "@/server/member";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { audits, db, desc, eq } from "@captable/db";
import { allEsignAuditsProcedure } from "./procedures/all-esign-audits";
import { ZodGetAuditsQuerySchema } from "./schema";

export const auditRouter = createTRPCRouter({
  getAudits: withAccessControl
    .meta({ policies: { audits: { allow: ["read"] } } })
    .input(ZodGetAuditsQuerySchema)
    .query(async ({ ctx, input }) => {
      const { session } = ctx;

      const data = await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const rawData = await tx
          .select()
          .from(audits)
          .where(eq(audits.companyId, companyId))
          .orderBy(desc(audits.occurredAt))
          .limit(input.take || 50)
          .offset(input.skip || 0);

        // Convert Date objects to ISO strings for API response
        const data = rawData.map((audit) => ({
          ...audit,
          occurredAt: audit.occurredAt.toISOString(),
        }));

        return data;
      });

      return { data };
    }),

  allEsignAudits: allEsignAuditsProcedure,
});
