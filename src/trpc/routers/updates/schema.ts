import { UpdateEmailStatusEnum } from "@/prisma-enums";

import { z } from "zod";

export const UpdatesMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  title: z.string(),
  content: z.string(),
  html: z.string(),
  isPublic: z.boolean().optional().default(false),
  recipients: z.array(z.string()).optional(),
  emailStatus: z
    .nativeEnum(UpdateEmailStatusEnum, {
      errorMap: () => ({ message: "Invalid email status" }),
    })
    .optional(),
});

export type UpdatesMutationType = z.infer<typeof UpdatesMutationSchema>;
