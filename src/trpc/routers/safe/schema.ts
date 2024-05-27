import { SafeTemplateEnum } from "@/prisma/enums";
import { z } from "zod";
import { ZodTemplateFieldRecipientSchema } from "../template-router/schema";

const commonSafeSchema = z.object({
  safeId: z.string().min(1),
  valuationCap: z.coerce.number(),
  discountRate: z.coerce.number().optional(),
  proRata: z.boolean(),
  capital: z.coerce.number(),
  issueDate: z.string().date(),
  boardApprovalDate: z.string().date(),
  stakeholderId: z.string(),
});

const safeTemplateKeys = Object.keys(SafeTemplateEnum).filter(
  (item) => item !== "CUSTOM",
) as [Exclude<keyof typeof SafeTemplateEnum, "CUSTOM">];

const newSafeSchema = ZodTemplateFieldRecipientSchema.merge(commonSafeSchema);

const customTemplateSchema = z
  .object({
    document: z.object({
      bucketId: z.string(),
      name: z.string(),
    }),
  })
  .merge(newSafeSchema);

export const ZodCreateSafeMutationSchema = z.discriminatedUnion(
  "safeTemplate",
  [
    z
      .object({
        safeTemplate: z.literal("CUSTOM"),
      })
      .merge(customTemplateSchema),

    z
      .object({
        safeTemplate: z.enum(safeTemplateKeys),
      })
      .merge(newSafeSchema),
  ],
);

export type TypeZodCreateSafeMutationSchema = z.infer<
  typeof ZodCreateSafeMutationSchema
>;

export const ZodDeleteSafesMutationSchema = z.object({
  safeId: z.string(),
});

export type TypeZodDeleteSafesMutationSchema = z.infer<
  typeof ZodDeleteSafesMutationSchema
>;

export const ZodAddExistingSafeMutationSchema = z
  .object({
    documents: z.array(
      z.object({
        bucketId: z.string(),
        name: z.string(),
      }),
    ),
  })
  .merge(commonSafeSchema);

export type TypeZodAddExistingSafeMutationSchema = z.infer<
  typeof ZodAddExistingSafeMutationSchema
>;
