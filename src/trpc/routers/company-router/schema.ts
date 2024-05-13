import { z } from "zod";

export const ZodSwitchCompanyMutationSchema = z.object({
  id: z.string(),
});

export const GetCompanySchema = z.object({
  companyId: z.string(),
});

export type TypeZodSwitchCompanyMutationSchema = z.infer<
  typeof ZodSwitchCompanyMutationSchema
>;

export type TypeGetCompanySchema = z.infer<typeof GetCompanySchema>;
