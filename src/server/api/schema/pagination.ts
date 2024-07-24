import { z } from "@hono/zod-openapi";

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

export const PaginationResponseSchema = z
  .object({
    hasPreviousPage: z.boolean().openapi({
      description:
        "Indicates if there is a previous page available in the pagination. `true` if there are more pages before the current one, `false` otherwise.",
      example: true,
    }),

    hasNextPage: z.boolean().openapi({
      description:
        "Indicates if there is a next page available in the pagination. `true` if there are more pages after the current one, `false` otherwise.",
      example: false,
    }),

    startCursor: z.string().nullable().openapi({
      description:
        "A cursor representing the starting point of the current page. Useful for querying the first item of the current page or the last item of the previous page.",
      example: "cly151kxq0000i7ngb3erchgo",
    }),

    endCursor: z.string().nullable().openapi({
      description:
        "A cursor representing the end point of the current page. Useful for querying the last item of the current page or the first item of the next page.",
      example: "cly151kxq0000i7ngb3erchgo",
    }),
  })
  .openapi("Pagination");
