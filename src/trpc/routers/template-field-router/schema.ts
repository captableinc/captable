import { z } from 'zod'

import { FieldTypes, TemplateStatus } from '@/prisma/enums'

const TemplateFieldMetaType = z.object({
  options: z
    .array(z.object({ id: z.string(), value: z.string() }))
    .nonempty()
    .optional(),
})

export type TTemplateFieldMetaType = z.infer<typeof TemplateFieldMetaType>

export const ZodAddFieldMutationSchema = z.object({
  status: z.nativeEnum(TemplateStatus),
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
      meta: TemplateFieldMetaType.optional(),
    }),
  ),
  message: z.string().optional(),
})

export type TypeZodAddFieldMutationSchema = z.infer<
  typeof ZodAddFieldMutationSchema
>
