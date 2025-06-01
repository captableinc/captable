import { getPresignedGetUrl } from "@/server/file-uploads";
import { withoutAuth } from "@/trpc/api/trpc";
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
import { DecodeEmailToken } from "../../template-field-router/procedures/add-fields";
import { ZodGetSigningFieldsSchema } from "../schema";

export const getSigningFieldsProcedure = withoutAuth
  .input(ZodGetSigningFieldsSchema)
  .query(async ({ ctx: _ctx, input }) => {
    const { id: templateId, rec: recipientId } = await DecodeEmailToken(
      input.token,
    );

    const { bucket, fields, status } = await db.transaction(async (tx) => {
      const recipientResult = await tx
        .select({
          templateId: esignRecipients.templateId,
        })
        .from(esignRecipients)
        .where(
          and(
            eq(esignRecipients.id, recipientId),
            eq(esignRecipients.templateId, templateId),
            eq(esignRecipients.status, "SENT"),
          ),
        )
        .limit(1);

      const recipient = recipientResult[0];
      if (!recipient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipient not found or not authorized to sign",
        });
      }

      const templateResult = await tx
        .select({
          bucketKey: buckets.key,
          status: templates.status,
        })
        .from(templates)
        .leftJoin(buckets, eq(templates.bucketId, buckets.id))
        .where(eq(templates.id, recipient.templateId))
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
        .where(eq(templateFields.templateId, recipient.templateId))
        .orderBy(asc(templateFields.top));

      return {
        bucket: { key: template.bucketKey },
        fields,
        status: template.status,
      };
    });

    if (!bucket.key) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Template file not found",
      });
    }

    const { key, url } = await getPresignedGetUrl(bucket.key);

    return {
      fields,
      key,
      url,
      recipientId,
      templateId,
      status,
      signableFields: fields.filter((item) => item.recipientId === recipientId),
    };
  });
