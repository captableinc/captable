import { checkMembership } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
import { and, db, eq, esignAudits, templates } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodAllEsignAuditsQuerySchema } from "../schema";

export const allEsignAuditsProcedure = withAccessControl
  .meta({ policies: { audits: { allow: ["read"] } } })
  .input(ZodAllEsignAuditsQuerySchema)
  .query(async ({ ctx, input }) => {
    const { session } = ctx;
    const { templatePublicId } = input;

    const { audits } = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const templateResult = await tx
        .select({
          id: templates.id,
        })
        .from(templates)
        .where(eq(templates.publicId, templatePublicId))
        .limit(1);

      const template = templateResult[0];
      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      const audits = await tx
        .select()
        .from(esignAudits)
        .where(
          and(
            eq(esignAudits.companyId, companyId),
            eq(esignAudits.templateId, template.id),
          ),
        );

      return { audits };
    });

    return { audits };
  });
