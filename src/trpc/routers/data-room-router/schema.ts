import { z } from "zod";

export const DataRoomSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "Data room name is required",
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
});

export const DataRoomRecipientSchema = z.object({
  value: z.string(),
  token: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  institutionName: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

export type DataRoomType = z.infer<typeof DataRoomSchema>;
export type DataRoomRecipientType = z.infer<typeof DataRoomRecipientSchema>;
