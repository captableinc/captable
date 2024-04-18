import {
  ALL_RECIPIENT_VALUE,
  generateAllRecipientGroup,
} from "@/constants/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { publicProcedure } from "@/trpc/api/trpc";
import { DecodeEmailToken } from "../../template-field-router/procedures/add-fields";
import { ZodGetSigningFieldsSchema } from "../schema";

export const getSigningFieldsProcedure = publicProcedure
  .input(ZodGetSigningFieldsSchema)
  .query(async ({ ctx, input }) => {
    const { id: templateId, rec: recipientId } = await DecodeEmailToken(
      input.token,
    );

    const { bucket, fields } = await ctx.db.$transaction(async (tx) => {
      const recipient = await tx.esignRecipient.findFirstOrThrow({
        where: {
          id: recipientId,
          templateId,
          status: "PENDING",
        },
        select: {
          templateId: true,
        },
      });

      const { bucket } = await tx.template.findFirstOrThrow({
        where: {
          id: recipient.templateId,
        },
        select: {
          bucket: {
            select: {
              key: true,
            },
          },
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
          group: true,
          prefilledValue: true,
        },
        orderBy: {
          top: "asc",
        },
      });

      return { bucket, fields };
    });

    const { key, url } = await getPresignedGetUrl(bucket.key);

    const filteredFields = fields.filter((item) => {
      if (item.group.startsWith(ALL_RECIPIENT_VALUE)) {
        return item.group === generateAllRecipientGroup(recipientId);
      } else {
        return true;
      }
    });
    return {
      fields: filteredFields,
      key,
      url,
      recipientId,
      templateId,
    };
  });
