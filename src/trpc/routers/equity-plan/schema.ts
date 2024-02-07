import { z } from "zod";

const userObject = z.object({
  id: z.string(),
  name: z.string(),
});

const commentObject = z.object({
  user: userObject,
  comment: z.string(),
  date: z.string(),
});

export const EquityPlanMutationSchema = z.object({
  id: z.string().optional(),
  idx: z.number().optional(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  boardApprovalDate: z.string().min(1, {
    message: "Board approval date is required",
  }),
  initialSharesReserved: z.coerce.number().min(0, {
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
  comments: z.array(commentObject).optional(),
});

export type EquityPlanMutationType = z.infer<typeof EquityPlanMutationSchema>;
