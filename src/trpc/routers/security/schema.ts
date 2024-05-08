import { z } from "zod";
import { ZCurrentPasswordSchema, ZPasswordSchema } from "../auth/schema";

export const ZChangePasswordMutationSchema = z.object({
  currentPassword: ZCurrentPasswordSchema,
  newPassword: ZPasswordSchema,
});
