import { SafeTypeEnum, SafeStatusEnum } from "@/prisma-enums";

import { z } from "zod";

export const SafeMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string(),
  type: z.nativeEnum(SafeTypeEnum, {
    errorMap: () => ({ message: "Invalid value for type" }),
  }),
  status: z.nativeEnum(SafeStatusEnum, {
    errorMap: () => ({ message: "Invalid value for status" }),
  }),
  capital: z.number(),
  valuationCap: z.number().optional(),
  discountRate: z.number().optional(),
  mfn: z.boolean().optional(),
  proRata: z.boolean().optional(),
  additionalTerms: z.string().optional(),

  companyId: z.string().optional(),
  shareholderId: z.string(),

  issueDate: z.date().optional(),
  boardApprovalDate: z.date().optional(),
});

export type SafeMutationType = z.infer<typeof SafeMutationSchema>;
