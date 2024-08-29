import { z } from "@hono/zod-openapi";
import { DEFAULT_PAGINATION_LIMIT, OFFSET_MAXIMUM_LIMIT } from "../const";

const sortDirections = ["asc", "desc"] as const;
type SortDirection = (typeof sortDirections)[number];

export const OffsetPaginationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .max(OFFSET_MAXIMUM_LIMIT)
    .positive()
    .optional()
    .default(DEFAULT_PAGINATION_LIMIT)
    .openapi({
      description: `The number of items to return per page. The maximum value is ${OFFSET_MAXIMUM_LIMIT}.`,
      param: {
        name: "limit",
        in: "query",
      },
      example: DEFAULT_PAGINATION_LIMIT,
      default: DEFAULT_PAGINATION_LIMIT,
      maximum: OFFSET_MAXIMUM_LIMIT,
      minimum: 1,
    }),
  page: z.coerce
    .number()
    .positive()
    .optional()
    .default(1)
    .openapi({
      description: "The page number to retrieve. Starts from 1.",
      param: {
        name: "page",
        in: "query",
      },
      example: 1,
      default: 1,
      minimum: 1,
    })
    .openapi("Offset Pagination query"),
});

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
  .openapi("Pagination Cursor");

export const OffsetPaginationResponseSchema = z
  .object({
    isFirstPage: z.boolean().openapi({
      description:
        "Indicates whether the current page is the first page of the pagination.",
    }),
    isLastPage: z.boolean().openapi({
      description:
        "Indicates whether the current page is the last page of the pagination.",
    }),
    currentPage: z.number().openapi({
      description: "The current page number in the pagination.",
    }),
    previousPage: z.number().nullable().openapi({
      description:
        "The previous page number in the pagination. Null if the current page is the first page.",
    }),
    nextPage: z.number().nullable().openapi({
      description:
        "The next page number in the pagination. Null if the current page is the last page.",
    }),
    pageCount: z.number().openapi({
      description: "The total number of pages available.",
    }),
    totalCount: z.number().openapi({
      description: "The total number of items across all pages.",
    }),
  })
  .openapi("Offset Pagination", {
    description:
      "A schema representing the pagination details of an offset-based pagination system.",
  });

export function generateSortParam<T extends readonly string[]>(sortFields: T) {
  type SortField = T[number];
  type SortParam = `${SortField}.${SortDirection}`;

  const sortParams = sortFields.flatMap((field) =>
    sortDirections.map((direction) => `${field}.${direction}` as const),
  ) as readonly SortParam[];

  const parseSortParam = <S extends SortParam>(sort: S) => {
    type Field = S extends `${infer F}.${SortDirection}` ? F : never;
    const [field, direction] = sort.split(".") as [Field, SortDirection];
    return { [field]: direction } as { [K in Field]: SortDirection };
  };
  return {
    schema: z.enum(sortParams as [SortParam, ...SortParam[]]).openapi({
      description: "sort by",
      param: {
        name: "sort",
        in: "query",
      },
    }),
    sortParams,
    parseSortParam,
  };
}
