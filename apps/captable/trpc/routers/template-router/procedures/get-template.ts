import { getPresignedGetUrl } from "@/server/file-uploads";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  and,
  asc,
  buckets,
  db,
  eq,
  esignRecipients,
  templateFields,
  templates,
} from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodGetTemplateQuerySchema } from "../schema";

export const getTemplateProcedure = withAuth
  .input(ZodGetTemplateQuerySchema)
  .query(async ({ ctx, input }) => {
    const { template } = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session: ctx.session });

      // Build the where condition
      const whereConditions = [
        eq(templates.publicId, input.publicId),
        eq(templates.companyId, companyId),
      ];

      if (input.isDraftOnly) {
        whereConditions.push(eq(templates.status, "DRAFT"));
      }

      const templateResult = await tx
        .select({
          name: templates.name,
          status: templates.status,
          bucketKey: buckets.key,
          templateId: templates.id,
        })
        .from(templates)
        .leftJoin(buckets, eq(templates.bucketId, buckets.id))
        .where(and(...whereConditions))
        .limit(1);

      const template = templateResult[0];
      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      const fields = await tx
        .select({
          id: templateFields.id,
          name: templateFields.name,
          width: templateFields.width,
          height: templateFields.height,
          top: templateFields.top,
          left: templateFields.left,
          required: templateFields.required,
          defaultValue: templateFields.defaultValue,
          readOnly: templateFields.readOnly,
          type: templateFields.type,
          viewportHeight: templateFields.viewportHeight,
          viewportWidth: templateFields.viewportWidth,
          page: templateFields.page,
          recipientId: templateFields.recipientId,
          prefilledValue: templateFields.prefilledValue,
          meta: templateFields.meta,
        })
        .from(templateFields)
        .where(eq(templateFields.templateId, template.templateId))
        .orderBy(asc(templateFields.top));

      const recipients = await tx
        .select({
          email: esignRecipients.email,
          id: esignRecipients.id,
          name: esignRecipients.name,
        })
        .from(esignRecipients)
        .where(eq(esignRecipients.templateId, template.templateId));

      return {
        template: {
          ...template,
          bucket: { key: template.bucketKey },
          fields,
          eSignRecipient: recipients,
        },
      };
    });

    if (!template.bucket.key) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Template file not found",
      });
    }

    const { key, url } = await getPresignedGetUrl(template.bucket.key);

    return {
      fields: template.fields,
      key,
      url,
      name: template.name,
      status: template.status,
      recipients: template.eSignRecipient,
    };
  });
