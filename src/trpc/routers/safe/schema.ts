import { SafeTypeEnum, SafeStatusEnum } from "@/prisma-enums";

import { z } from "zod";

export const SafeMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string(),
  type: z.nativeEnum(SafeTypeEnum, {
    errorMap: () => ({ message: "Invalid SAFE type" }),
  }),
  status: z.nativeEnum(SafeStatusEnum, {
    errorMap: () => ({ message: "Invalid SAFE status" }),
  }),
  capital: z.number(),
  valuationCap: z.number().optional(),
  discountRate: z.number().optional(),
  mfn: z.boolean().optional(),
  proRata: z.boolean().optional(),
  additionalTerms: z.string().optional(),

  shareholderId: z.string().optional(),

  investorName: z.string().optional(),
  investorEmail: z.string().email().optional(),
  investorInstitutionName: z.string().optional(),

  issueDate: z.date().optional(),
  boardApprovalDate: z.date().optional(),

  documents: z.array(z.string()).optional(),
});

export type SafeMutationType = z.infer<typeof SafeMutationSchema>;
