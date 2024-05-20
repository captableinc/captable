import { z } from "zod";

export const ZodCreateBucketMutationSchema = z.array(
  z.object({
    name: z.string(),
    key: z.string(),
    mimeType: z.string(),
    size: z.number(),
    tags: z.array(z.string()),
  }),
);

export type TypeZodCreateBucketMutationSchema = z.infer<
  typeof ZodCreateBucketMutationSchema
>;
