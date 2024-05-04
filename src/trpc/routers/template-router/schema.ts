import { z } from "zod";

export const ZodCreateTemplateMutationSchema = z.object({
  name: z.string(),
  bucketId: z.string(),
  recipients: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }),
  ),
  orderedDelivery: z.boolean(),
});

export const ZodGetTemplateQuerySchema = z.object({
  publicId: z.string(),
  isDraftOnly: z.boolean(),
});

export const ZodSignTemplateMutationSchema = z.object({
  templateId: z.string(),
  data: z.record(z.string()),
  recipientId: z.string(),
});

export const ZodGetSigningFieldsSchema = z.object({
  token: z.string(),
});
