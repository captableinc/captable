import { z } from "zod";

export const DEFAULT_PAGINATION_LIMIT = 50;

export const PaginationQuerySchema = z.object({
  limit: z
    .preprocess(
      (val) =>
        val === undefined ? undefined : Number.parseInt(val as string, 10),
      z
        .number()
        .int()
        .positive()
        .min(1)
        .max(50)
        .default(DEFAULT_PAGINATION_LIMIT),
    )
    .openapi({
      description: "Number of items to take",
      param: {
        name: "limit",
        in: "query",
      },
      example: 25,
      default: DEFAULT_PAGINATION_LIMIT,
      minimum: 1,
      maximum: 250,
    }),

  cursor: z
    .string()
    .cuid()
    .optional()
    .openapi({
      description: "Cursor for the next page",
      param: {
        name: "cursor",
        in: "query",
      },
      example: "cly151kxq0000i7ngb3erchgo", // CUID of the last item
    }),
});

export type TPaginationQuerySchema = z.infer<typeof PaginationQuerySchema>;

export const PaginationResponseSchema = z.object({
  count: z.number().int().positive().openapi({
    description: "Number of records returned",
    example: 50,
  }),

  total: z.number().int().positive().nullable().openapi({
    description: "Total number of records",
    example: 100,
  }),

  cursor: z.string().nullable().openapi({
    description: "Next page cursor",
    example: "cly151kxq0000i7ngb3erchgo",
  }),
});
