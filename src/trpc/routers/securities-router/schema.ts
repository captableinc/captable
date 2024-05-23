import {
  OptionStatusEnum,
  OptionTypeEnum,
  VestingScheduleEnum,
} from "@/prisma/enums";
import { z } from "zod";

export const ZodAddOptionMutationSchema = z.object({
  id: z.string().optional(),
  grantId: z.string(),
  notes: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0),
  exercisePrice: z.coerce.number().min(0),
  type: z.nativeEnum(OptionTypeEnum),
  status: z.nativeEnum(OptionStatusEnum),
  vestingSchedule: z.nativeEnum(VestingScheduleEnum),
  issueDate: z.string().date(),
  expirationDate: z.string().date(),
  vestingStartDate: z.string().date(),
  boardApprovalDate: z.string().date(),
  rule144Date: z.string().date(),
  documents: z.array(
    z.object({
      bucketId: z.string(),
      name: z.string(),
    }),
  ),
  stakeholderId: z.string(),
  equityPlanId: z.string(),
});

export type TypeZodAddOptionMutationSchema = z.infer<
  typeof ZodAddOptionMutationSchema
>;

export const ZodDeleteOptionMutationSchema = z.object({
  optionId: z.string(),
});

export type TypeZodDeleteOptionMutationSchema = z.infer<
  typeof ZodDeleteOptionMutationSchema
>;
