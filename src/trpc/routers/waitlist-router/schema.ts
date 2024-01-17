import { z } from "zod";

export const ZodAddToWaitListMutationSchema = z.object({
  email: z.string().email().min(1),
});

export type TypeZodAddToWaitListMutationSchema = z.infer<
  typeof ZodAddToWaitListMutationSchema
>;
