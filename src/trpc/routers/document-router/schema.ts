import { z } from "zod";

export const ZodCreateDocumentMutationSchema = z.object({
  name: z.string(),
  bucketId: z.string(),
  convertibleNoteId: z.string().optional(),
});

export type TypeZodCreateDocumentMutationSchema = z.infer<
  typeof ZodCreateDocumentMutationSchema
>;

export const ZodGetDocumentQuerySchema = z.object({
  publicId: z.string(),
});

export type TypeZodGetDocumentQuerySchema = z.infer<
  typeof ZodGetDocumentQuerySchema
>;
