import { z } from "zod";

export const ZodCreateBucketMutationSchema = z.object({
  name: z.string(),
  key: z.string(),
  mimeType: z.string(),
  size: z.number(),
});
