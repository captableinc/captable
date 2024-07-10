import { z } from "zod";

export const PaginationQuerySchema = z.object({
  limit: z
    .preprocess(
      (val) =>
        val === undefined ? undefined : Number.parseInt(val as string, 10),
      z.number().int().positive().min(1).max(50).default(10),
    )
    .openapi({
      description: "Number of items to take",
      param: {
        name: "limit",
        in: "query",
      },
      example: 10,
      default: 10,
      minimum: 5,
      maximum: 50,
    }),

  cursor: z
    .string()
    .optional()
    .openapi({
      description: "Cursor for the next page",
      param: {
        name: "cursor",
        in: "query",
      },
      example: "cly151kxq0000i7ngb3erchgo", // CUID of the last item
    }),

  total: z
    .preprocess(
      (val) =>
        val === undefined ? undefined : Number.parseInt(val as string, 10),
      z.number().int().positive().optional(),
    )
    .openapi({
      description: "Total Number of Records",
      param: {
        name: "total",
        in: "query",
      },
    }),
});

export type TPaginationQuerySchema = z.infer<typeof PaginationQuerySchema>;

export const PaginationResponseSchema = z.object({
  count: z.number().int().positive().openapi({
    description: "Number of records returned",
    example: 50,
  }),

  total: z.number().int().positive().openapi({
    description: "Total number of records",
    example: 100,
  }),

  cursor: z.string().optional().openapi({
    description: "Next page cursor",
    example: "cly151kxq0000i7ngb3erchgo",
  }),
});
