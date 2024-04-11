import { UpdateEmailStatusEnum } from "@/prisma/enums";

import { z } from "zod";

export const UpdateMutationSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  title: z.string(),
  content: z.any(),
  html: z.string(),
  isPublic: z.boolean().optional(),
  recipients: z.array(z.string()).optional(),
  emailStatus: z
    .nativeEnum(UpdateEmailStatusEnum, {
      errorMap: () => ({ message: "Invalid email status" }),
    })
    .optional(),
});

export type UpdateMutationType = z.infer<typeof UpdateMutationSchema>;
