import { z } from "zod";

export const ShareClassMutationSchema = z.object({
  id: z.string().optional(),
  idx: z.number().optional(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  classType: z.enum(["common", "preferred"]),
  prefix: z.enum(["CS", "PS"]),
  initialSharesAuthorized: z.number().min(1, {
    message: "Initial shares authorized is required",
  }),
  boardApprovalDate: z.string().min(1, {
    message: "Board approval date is required",
  }),
  stockholderApprovalDate: z.string().min(1, {
    message: "Stockholder approval date is required",
  }),
  votesPerShare: z.number().min(1, {
    message: "Votes per share is required",
  }),
  parValue: z.number().min(1, {
    message: "Par value is required",
  }),
  pricePerShare: z.number().min(1, {
    message: "Price per share is required",
  }),
  seniority: z.number().min(1, {
    message: "Seniority is required",
  }),

  // Conversion rights
  convertsToFutureRound: z.boolean().optional(),
  convertsToShareClassId: z.string().optional(),

  liquidationPreferenceMultiple: z.number().min(1, {
    message: "Liquidation preference multiple is required",
  }),
  participationCapMultiple: z.number().min(1, {
    message: "Participation cap multiple is required",
  }),
});

export type ShareClassMutationType = z.infer<typeof ShareClassMutationSchema>;
