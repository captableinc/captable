import { z } from "@hono/zod-openapi";

export const ApiSecuritiesSchema = z.object({
  id: z.string().cuid().openapi({
    description: "Security ID",
    example: "cly402ncj0000i7ng9l0v04qr",
  }),
});

export type ApiSecuritiesType = z.infer<typeof ApiSecuritiesSchema>;
