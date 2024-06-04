import { TAG } from "@/lib/tags";
import { z } from "zod";

export const ZodCreateBucketMutationSchema = z.object({
  name: z.string(),
  key: z.string(),
  mimeType: z.string(),
  size: z.number(),
  tags: z.array(z.nativeEnum(TAG)),
});

export type TypeZodCreateBucketMutationSchema = z.infer<
  typeof ZodCreateBucketMutationSchema
>;
