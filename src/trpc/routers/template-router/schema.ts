import { z } from "zod";

export const ZodCreateTemplateMutationSchema = z.object({
  name: z.string(),
  bucketId: z.string(),
  recipients: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }),
  ),
  orderedDelivery: z.boolean(),
});

export const ZodGetTemplateQuerySchema = z.object({
  publicId: z.string(),
  isDraftOnly: z.boolean(),
});

export const ZodSignTemplateMutationSchema = z.object({
  templateId: z.string(),
  data: z.record(z.string()),
  recipientId: z.string(),
});

export const ZodGetSigningFieldsSchema = z.object({
  token: z.string(),
});

export const ZodSendEsignEmailSchema = z.object({
  optionalMessage: z.string().or(z.null()),
  completedOn: z.date().or(z.null()),
  documentName: z.string(),
  templateId: z.string(),
  recipients: z.array(
    z.object({
      id: z.string(),
      name: z.string().or(z.null()),
      email: z.string().email().min(6),
    }),
  ),
  company: z.object({
    name: z.string(),
    logo: z.string(),
  }),
  expiryDate: z.string().optional(),
});

export type TypeZodSendEsignEmailSchema = z.infer<
  typeof ZodSendEsignEmailSchema
>;
