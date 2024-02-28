import { z } from "zod";

import { FieldTypes } from "@/prisma-enums";

export const ZodAddFieldMutationSchema = z.object({
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
      placeholder: z.string(),
      type: z.nativeEnum(FieldTypes),
      viewportHeight: z.number(),
      viewportWidth: z.number(),
      page: z.number(),
    }),
  ),
});

export type TypeZodAddFieldMutationSchema = z.infer<
  typeof ZodAddFieldMutationSchema
>;
