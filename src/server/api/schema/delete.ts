import { z } from "@hono/zod-openapi";

export const ApiDeleteResponseSchema = z.object({
  success: z.boolean().openapi({
    description: "Success",
    example: true,
  }),

  message: z.string().openapi({
    description: "Message",
    example: "Resource successfully deleted",
  }),
});
