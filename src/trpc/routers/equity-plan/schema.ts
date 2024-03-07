import { z } from "zod";

export const EquityPlanMutationSchema = z.object({
  id: z.string().optional(),
  idx: z.number().optional(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  planEffectiveDate: z.coerce.date().optional().nullable(),
  initialSharesReserved: z.coerce.number().min(1, {
    message: "Initial reserved shares is required",
  }),
  shareClassId: z.string().min(1, {
    message: "Share class is required",
  }),
  defaultCancellatonBehavior: z.enum([
    "RETIRE",
    "RETURN_TO_POOL",
    "HOLD_AS_CAPITAL_STOCK",
    "DEFINED_PER_PLAN_SECURITY",
  ]),
  comments: z.string().optional(),
});

export type EquityPlanMutationType = z.infer<typeof EquityPlanMutationSchema>;

export const AddOptionsMutationSchema = z.object({
  id: z.string().optional(),
  notes: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0, {
    message: "Quantity is required",
  }),
  exercisePrice: z.coerce.number().min(0, {
    message: "Exercise price is required",
  }),

  type: z.enum(["ISO", "NSU", "RSU"]),

  status: z.enum(["DRAFT", "ACTIVE", "EXERCISED", "EXPIRED", "CANCELLED"]),

  vestingSchedule: z.enum([
    "VESTING_0_0_0",
    "VESTING_0_0_1",
    "VESTING_4_1_0",
    "VESTING_4_1_1",
    "VESTING_4_3_1",
    "VESTING_4_6_1",
    "VESTING_4_12_1",
  ]),

  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "This is not a valid date",
  }),
  expirationDate: z.coerce.date({
    required_error: "Expiration date is required",
    invalid_type_error: "This is not a valid date",
  }),
  vestingStartDate: z.coerce.date({
    required_error: "Expiration date is required",
    invalid_type_error: "This is not a valid date",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board Approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  rule144Date: z.coerce.date({
    required_error: "Rule 144 date is required",
    invalid_type_error: "This is not a valid date",
  }),

  documents: z.string(),
});

export type AddOptionsMutationType = z.infer<typeof AddOptionsMutationSchema>;
