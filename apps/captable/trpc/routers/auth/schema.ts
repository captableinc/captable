import { z } from "zod";
export const ZCurrentPasswordSchema = z
  .string()
  .min(6, { message: "Must be at least 6 characters in length" })
  .max(72);

export const ZPasswordSchema = z
  .string()
  .regex(/.*[A-Z].*/, { message: "One uppercase character" })
  .regex(/.*[a-z].*/, { message: "One lowercase character" })
  .regex(/.*\d.*/, { message: "One number" })
  .regex(/.*[`~<>?,.\/!@#$%^&*()\-_+=\"'|{}\[\];:\\].*/, {
    message: "One special character is required",
  })
  .min(8, { message: "Must be at least 8 characters in length" })
  .max(72, { message: "Cannot be more than 72 characters in length" });

export const ZSignUpMutationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: ZPasswordSchema,
});

export const ZNewPasswordProcedureSchema = z.object({
  token: z.string(),
  password: z.string(),
});
