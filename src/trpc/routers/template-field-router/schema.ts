import { z } from "zod";

import { FieldTypes, TemplateStatus } from "@/prisma/enums";

export const ZodAddFieldMutationSchema = z.object({
  status: z.nativeEnum(TemplateStatus),
  completedOn: z.date().optional(),
  templatePublicId: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      width: z.number(),
      height: z.number(),
      top: z.number(),
      left: z.number(),
      required: z.boolean(),
      type: z.nativeEnum(FieldTypes),
      viewportHeight: z.number(),
      viewportWidth: z.number(),
      page: z.number(),
      defaultValue: z.string(),
      readOnly: z.boolean(),
      recipientId: z.string(),
    }),
  ),
  emailPayload: z.object({
    optionalMessage: z.string().optional(),
    expiryDate: z.date().or(z.null()).or(z.string()).optional(),
    documentName: z.string(),
    company: z.object({
      name: z.string(),
      logo: z.string().optional(),
    }),
  }),
});

export type TypeZodAddFieldMutationSchema = z.infer<
  typeof ZodAddFieldMutationSchema
>;
