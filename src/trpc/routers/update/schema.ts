import { UpdateType } from "@/lib/constants";
import { UpdateEmailStatusEnum, UpdateStatusEnum } from "@/prisma-enums";
import { z } from "zod";

export const UpdateMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  title: z.string(),
  content: z.any(),
  html: z.string(),
  isPublic: z.boolean().optional(),
  recipients: z.array(z.string()).optional(),
  emailStatus: z
    .nativeEnum(UpdateEmailStatusEnum, {
      errorMap: () => ({ message: "Invalid email status" }),
    })
    .optional(),
});

export type UpdateMutationType = z.infer<typeof UpdateMutationSchema>;

const SaveAndSendSchema = z.object({
  html: z.string(),
  title: z.string(),
  content: z.any(),
  stakeholders: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
    }),
  ),
  authorName: z.string().min(2).optional(),
  authorImage: z.string().min(2).optional(),
  authorTitle: z.string().optional(),
  authorWorkEmail: z.string().optional(),
  companyName: z.string().min(2),
  companyLogo: z.string().optional(),
  isFirstEmailSent: z.boolean().optional(),
});

const SendOnlySchema = z.object({
  publicId: z.string(),
  updateId: z.string(),
  html: z.string(),
  title: z.string(),
  content: z.any(),
  newStakeholders: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
    }),
  ),
  isDraft: z.boolean(),
  authorName: z.string().min(2).optional(),
  authorImage: z.string().min(2).optional(),
  authorTitle: z.string().optional(),
  authorWorkEmail: z.string().optional(),
  companyName: z.string().min(2).optional(),
  companyLogo: z.string().optional(),
  isFirstEmailSent: z.boolean().optional(),
});

export const SaveAndSendInput = z.object({
  type: z.literal(UpdateType.SAVE_AND_SEND),
  payload: SaveAndSendSchema,
});

export const SendOnlyInput = z.object({
  type: z.literal(UpdateType.SEND_ONLY),
  payload: SendOnlySchema,
});

export const ZodShareUpdateMutationSchema = SaveAndSendInput.or(SendOnlyInput);

export type TypeZodShareUpdateMutationSchema = z.infer<
  typeof ZodShareUpdateMutationSchema
>;

export const ZodGetUpdateProcedure = z.object({
  publicId: z.string(),
});

export type TypeZodGetUpdateProcedure = z.infer<typeof ZodGetUpdateProcedure>;

export const ZodGetRecipientsProcedure = z.object({
  publicId: z.string(),
});

export type TypeZodGetRecipientsProcedure = z.infer<
  typeof ZodGetRecipientsProcedure
>;

export const ZodDeleteUpdateProcedure = z.object({
  updateId: z.string(),
  publicId: z.string(),
});

export type TypeZodDeleteUpdateProcedure = z.infer<
  typeof ZodDeleteUpdateProcedure
>;

export const ZodToggleStatusMutationSchema = z.object({
  currentStatus: z.nativeEnum(UpdateStatusEnum, {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  desireStatus: z.nativeEnum(UpdateStatusEnum, {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  publicId: z.string(),
});

export type TypeToggleStatusMutationSchema = z.infer<
  typeof ZodToggleStatusMutationSchema
>;
