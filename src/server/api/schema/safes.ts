import { z } from "@hono/zod-openapi";

export const ApiSafesSchema = z.object({
  id: z.string().cuid().openapi({
    description: "SAFE ID",
    example: "cly402ncj0000i7ng9l0v04qr",
  }),
});

export type ApiSafesType = z.infer<typeof ApiSafesSchema>;
