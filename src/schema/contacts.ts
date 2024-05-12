import { z } from 'zod'

export const ShareContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().optional(),
  value: z.string(),
  selected: z.boolean().optional(),
  institutionName: z.string().optional(),
  type: z.union([
    z.literal('member'),
    z.literal('stakeholder'),
    z.literal('other'),
  ]),
})

export const ShareRecipientSchema = z.object({
  value: z.string(),
  token: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  institutionName: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
})

export type ShareContactType = z.infer<typeof ShareContactSchema>
export type ShareRecipientType = z.infer<typeof ShareRecipientSchema>
