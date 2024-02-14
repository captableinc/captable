import { z } from "zod";

export const type = ["SAFE", "EQUITY", "GENERIC"] as const;

export type TDocumentType = (typeof type)[number];

export const uploadProvider = ["R2", "S3"] as const;

export const ZodCreateDocumentMutationSchema = z.object({
  name: z.string(),
  key: z.string(),
  type: z.enum(type),
  mimeType: z.string(),
  size: z.number(),
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
