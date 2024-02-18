import { z } from "zod";

export const ZodCreateTemplateMutationSchema = z.object({
  name: z.string(),
  bucketId: z.string(),
});

export const ZodGetTemplateQuerySchema = z.object({
  publicId: z.string(),
});
