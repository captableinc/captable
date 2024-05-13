import { z } from "zod";

export const ShareClassMutationSchema = z.object({
  id: z.string().optional(),
  idx: z.number().optional(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  classType: z.enum(["COMMON", "PREFERRED"]),
  prefix: z.enum(["CS", "PS"]).optional(),
  initialSharesAuthorized: z.coerce.number().min(1, {
    message: "Authorized shares is required",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  stockholderApprovalDate: z.coerce.date({
    required_error: "Stockholder approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  votesPerShare: z.coerce.number().min(0, {
    message: "Votes per share is required",
  }),
  parValue: z.coerce.number().min(0, {
    message: "Par value is required",
  }),
  pricePerShare: z.coerce.number().min(0, {
    message: "Price per share is required",
  }),
  seniority: z.coerce.number().min(0, {
    message: "Seniority is required",
  }),

  // Conversion rights
  conversionRights: z.enum([
    "CONVERTS_TO_FUTURE_ROUND",
    "CONVERTS_TO_SHARE_CLASS_ID",
  ]),
  convertsToShareClassId: z.string().nullable(),

  liquidationPreferenceMultiple: z.coerce.number().min(0, {
    message: "Liquidation preference multiple is required",
  }),
  participationCapMultiple: z.coerce.number().min(0, {
    message: "Participation cap multiple is required",
  }),
});

export type ShareClassMutationType = z.infer<typeof ShareClassMutationSchema>;
