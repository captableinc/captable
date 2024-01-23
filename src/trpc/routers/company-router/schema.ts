import { z } from "zod";

export const ZodSwitchCompanyMutationSchema = z.object({
  id: z.string(),
});

export type TypeZodSwitchCompanyMutationSchema = z.infer<
  typeof ZodSwitchCompanyMutationSchema
>;
