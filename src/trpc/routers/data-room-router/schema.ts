import { z } from 'zod'

export const DataRoomSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: 'Data room name is required',
  }),
  publicId: z.string().optional(),
  public: z.boolean().default(false),
  documents: z
    .array(
      z.object({
        documentId: z.string(),
      }),
    )
    .optional(),
  recipients: z
    .array(
      z.object({
        email: z.string(),
        memberId: z.string().optional(),
        stakeholderId: z.string().optional(),
        expiresAt: z.date().optional(),
      }),
    )
    .optional(),
})

export type DataRoomType = z.infer<typeof DataRoomSchema>
