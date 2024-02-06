import { z } from "zod";

export const ZodGetAuditsQuerySchema = z
  .object({
    take: z.number(),
    skip: z.number(),
  })
  .partial();

export type TypeZodGetAuditsQuerySchema = z.infer<
  typeof ZodGetAuditsQuerySchema
>;
