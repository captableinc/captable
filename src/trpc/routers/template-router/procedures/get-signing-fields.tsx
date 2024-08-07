import { getPresignedGetUrl } from "@/server/file-uploads";
import { withoutAuth } from "@/trpc/api/trpc";
import { DecodeEmailToken } from "../../template-field-router/procedures/add-fields";
import { ZodGetSigningFieldsSchema } from "../schema";

export const getSigningFieldsProcedure = withoutAuth
  .input(ZodGetSigningFieldsSchema)
  .query(async ({ ctx, input }) => {
    const { id: templateId, rec: recipientId } = await DecodeEmailToken(
      input.token,
    );

    const { bucket, fields, status } = await ctx.db.$transaction(async (tx) => {
      const recipient = await tx.esignRecipient.findFirstOrThrow({
        where: {
          id: recipientId,
          templateId,
          status: "SENT",
        },
        select: {
          templateId: true,
        },
      });

      const { bucket, status } = await tx.template.findFirstOrThrow({
        where: {
          id: recipient.templateId,
        },
        select: {
          bucket: {
            select: {
              key: true,
            },
          },
          status: true,
        },
      });

      const fields = await tx.templateField.findMany({
        where: {
          templateId: recipient.templateId,
        },
        select: {
          id: true,
          name: true,
          width: true,
          height: true,
          top: true,
          left: true,
          required: true,
          defaultValue: true,
          readOnly: true,
          type: true,
          viewportHeight: true,
          viewportWidth: true,
          page: true,
          recipientId: true,
          prefilledValue: true,
          meta: true,
        },
        orderBy: {
          top: "asc",
        },
      });

      return { bucket, fields, status };
    });

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
