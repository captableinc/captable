import { z } from "zod";
import { ZCurrentPasswordSchema, ZPasswordSchema } from "../auth/schema";

export const ZUpdatePasswordMutationSchema = z.object({
  currentPassword: ZCurrentPasswordSchema,
  newPassword: ZPasswordSchema,
});

export const ZodConnectGoogleMutationSchema = z.object({
  email: z.string(),
});

export type TypeZodConnectGoogleMutationSchema = z.infer<
  typeof ZodConnectGoogleMutationSchema
>;
