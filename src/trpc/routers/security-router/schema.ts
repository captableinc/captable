import { z } from "zod";
import { ZCurrentPasswordSchema, ZPasswordSchema } from "../auth/schema";

export const ZUpdatePasswordMutationSchema = z.object({
  currentPassword: ZCurrentPasswordSchema,
  newPassword: ZPasswordSchema,
});
