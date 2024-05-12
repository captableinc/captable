import { z } from 'zod'

export const EquityPlanMutationSchema = z.object({
  id: z.string().optional(),
  idx: z.number().optional(),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  boardApprovalDate: z.coerce.date({
    required_error: 'Board approval date is required',
    invalid_type_error: 'This is not a valid date',
  }),
  planEffectiveDate: z.coerce.date().optional().nullable(),
  initialSharesReserved: z.coerce.number().min(1, {
    message: 'Initial reserved shares is required',
  }),
  shareClassId: z.string().min(1, {
    message: 'Share class is required',
  }),
  defaultCancellatonBehavior: z.enum([
    'RETIRE',
    'RETURN_TO_POOL',
    'HOLD_AS_CAPITAL_STOCK',
    'DEFINED_PER_PLAN_SECURITY',
  ]),
  comments: z.string().optional(),
})

export type EquityPlanMutationType = z.infer<typeof EquityPlanMutationSchema>
