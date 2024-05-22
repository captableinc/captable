import { SafeStatusEnum, SafeTemplateEnum, SafeTypeEnum } from "@/prisma/enums";
import { z } from "zod";

export const SafeMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  type: z
    .nativeEnum(SafeTypeEnum, {
      errorMap: () => ({ message: "Invalid SAFE type" }),
    })
    .optional(),
  status: z
    .nativeEnum(SafeStatusEnum, {
      errorMap: () => ({ message: "Invalid SAFE status" }),
    })
    .optional(),
  capital: z.number(),
  valuationCap: z.number(),
  discountRate: z.number().default(0),
  mfn: z.boolean().optional(),
  proRata: z.boolean().optional(),
  additionalTerms: z.string().optional(),

  stakeholderId: z.string(),

  investorName: z.string(),
  investorEmail: z.string().email(),
  investorInstitutionName: z.string().optional(),

  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "This is not a valid date",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  safeTemplate: z.nativeEnum(SafeTemplateEnum, {
    errorMap: () => ({ message: "Invalid SAFE template" }),
  }),
  documents: z
    .array(
      z.object({
        bucketId: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
});

export type SafeMutationType = z.infer<typeof SafeMutationSchema>;

export const ZodDeleteSafesMutationSchema = z.object({
  safeId: z.string(),
});

export type TypeZodDeleteSafesMutationSchema = z.infer<
  typeof ZodDeleteSafesMutationSchema
>;

export const ZodAddExistingSafeMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  mfn: z.boolean().optional(),
  additionalTerms: z.string().optional(),
  investorName: z.string().optional(),
  investorEmail: z.string().email().optional(),
  investorInstitutionName: z.string().optional(),

  stakeholderId: z.string(),
  capital: z.number(),
  valuationCap: z.number(),
  discountRate: z.number().default(0),
  proRata: z.boolean().optional(),

  type: z
    .nativeEnum(SafeTypeEnum, {
      errorMap: () => ({ message: "Invalid SAFE type" }),
    })
    .optional(),

  status: z
    .nativeEnum(SafeStatusEnum, {
      errorMap: () => ({ message: "Invalid SAFE status" }),
    })
    .optional(),

  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "This is not a valid date",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board Approval date is required",
    invalid_type_error: "This is not a valid date",
  }),

  documents: z.array(
    z.object({
      bucketId: z.string(),
      name: z.string(),
    }),
  ),
});

export type TypeZodAddExistingSafeMutationSchema = z.infer<
  typeof ZodAddExistingSafeMutationSchema
>;
