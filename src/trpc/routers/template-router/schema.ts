import { z } from "zod";

export const ZodTemplateFieldRecipientSchema = z.object({
  recipients: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }),
  ),
  orderedDelivery: z.boolean(),
});

export const ZodCreateTemplateMutationSchema = z
  .object({
    name: z.string(),
    bucketId: z.string(),
  })
  .merge(ZodTemplateFieldRecipientSchema);

export type TypeZodCreateTemplateMutationSchema = z.infer<
  typeof ZodCreateTemplateMutationSchema
>;

export const ZodGetTemplateQuerySchema = z.object({
  publicId: z.string(),
  isDraftOnly: z.boolean(),
});

export const SignTemplateMutationSchema = z.object({
  templateId: z.string(),
  data: z.record(z.string()),
  recipientId: z.string(),
});

export const ZodGetSigningFieldsSchema = z.object({
  token: z.string(),
});

export const ZodCancelTemplateMutationSchema = z.object({
  templateId: z.string(),
  publicId: z.string(),
});
