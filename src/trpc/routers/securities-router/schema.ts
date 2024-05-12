import {
  OptionStatusEnum,
  OptionTypeEnum,
  VestingScheduleEnum,
} from '@/prisma/enums'
import { z } from 'zod'

export const ZodAddOptionMutationSchema = z.object({
  id: z.string().optional(),
  grantId: z.string(),
  notes: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0, {
    message: 'Quantity is required',
  }),
  exercisePrice: z.coerce.number().min(0, {
    message: 'Exercise price is required',
  }),
  type: z.nativeEnum(OptionTypeEnum, {
    errorMap: () => ({ message: 'Invalid value for option type' }),
  }),
  status: z.nativeEnum(OptionStatusEnum, {
    errorMap: () => ({ message: 'Invalid value for option status' }),
  }),
  vestingSchedule: z.nativeEnum(VestingScheduleEnum, {
    errorMap: () => ({ message: 'Invalid value for vestingSchedule' }),
  }),
  issueDate: z.coerce.date({
    required_error: 'Issue date is required',
    invalid_type_error: 'This is not a valid date',
  }),
  expirationDate: z.coerce.date({
    required_error: 'Expiration date is required',
    invalid_type_error: 'This is not a valid date',
  }),
  vestingStartDate: z.coerce.date({
    required_error: 'Vesting Start date is required',
    invalid_type_error: 'This is not a valid date',
  }),
  boardApprovalDate: z.coerce.date({
    required_error: 'Board Approval date is required',
    invalid_type_error: 'This is not a valid date',
  }),
  rule144Date: z.coerce.date({
    required_error: 'Rule 144 date is required',
    invalid_type_error: 'This is not a valid date',
  }),
  documents: z.array(
    z.object({
      bucketId: z.string(),
      name: z.string(),
    }),
  ),
  stakeholderId: z.string(),
  equityPlanId: z.string(),
})

export type TypeZodAddOptionMutationSchema = z.infer<
  typeof ZodAddOptionMutationSchema
>

export const ZodDeleteOptionMutationSchema = z.object({
  optionId: z.string(),
})

export type TypeZodDeleteOptionMutationSchema = z.infer<
  typeof ZodDeleteOptionMutationSchema
>
