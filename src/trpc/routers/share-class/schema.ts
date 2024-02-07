import { z } from "zod";

export const ShareClassMutationSchema = z.object({
  id: z.string().optional(),
  idx: z.number().optional(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  classType: z.enum(["common", "preferred"]),
  prefix: z.enum(["CS", "PS"]).optional(),
  initialSharesAuthorized: z.coerce.number().min(0, {
    message: "Initial shares authorized is required",
  }),
  boardApprovalDate: z.string().min(1, {
    message: "Board approval date is required",
  }),
  stockholderApprovalDate: z.string().min(1, {
    message: "Stockholder approval date is required",
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
  conversionRights: z.enum(["convertsToFutureRound", "convertsToShareClassId"]),
  convertsToShareClassId: z.string().optional(),

  liquidationPreferenceMultiple: z.coerce.number().min(0, {
    message: "Liquidation preference multiple is required",
  }),
  participationCapMultiple: z.coerce.number().min(0, {
    message: "Participation cap multiple is required",
  }),
});

export type ShareClassMutationType = z.infer<typeof ShareClassMutationSchema>;
