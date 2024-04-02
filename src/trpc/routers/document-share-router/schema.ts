import { z } from "zod";

export const DocumentShareMutationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  linkExpiresAt: z.coerce.date({
    required_error: "Board approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  recipients: z.string().optional(),
  emailProtected: z.boolean().default(true),
});

export type DocumentShareMutationType = z.infer<
  typeof DocumentShareMutationSchema
>;
