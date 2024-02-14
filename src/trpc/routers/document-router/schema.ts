import { z } from "zod";

export const DocumentMutationSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
});

export type DocumentMutationType = z.infer<typeof DocumentMutationSchema>;
