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
});

export const ZodSignTemplateMutationSchema = z.object({
  templatePublicId: z.string(),
  data: z.record(z.string()),
});
