import { z } from "zod";

export const DocumentShareMutationSchema = z.object({
  id: z.string().optional(),
  link: z.string().min(1, {
    message: "Link is required",
  }),
  linkExpiresAt: z.coerce.date({
    required_error: "Link expiry date is required",
    invalid_type_error: "This is not a valid date",
  }),
  recipients: z.string().optional(),
  emailProtected: z.boolean().default(true),
  documentId: z.string().min(1, {
    message: "Document Id is required",
  }),
  publicId: z.string().min(1, "PublicId is required"),
});

export type TypeDocumentShareMutation = z.infer<
  typeof DocumentShareMutationSchema
>;
