import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { OptionSchema } from "@/server/api/schema/option";
import {
  DEFAULT_PAGINATION_LIMIT,
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "@/server/api/schema/pagination";
import { getPaginatedOptions } from "@/server/services/stock-option/get-option";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

const ParamsSchema = z.object({
  id: z
    .string()
    .cuid()
    .openapi({
      description: "Company ID",
      param: {
        name: "id",
        in: "path",
      },

      example: "clxwbok580000i7nge8nm1ry0",
    }),
});

const ResponseSchema = z
  .object({
    data: z.array(OptionSchema),
    meta: PaginationResponseSchema,
  })
  .openapi({
    description: "Get Options by Company ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/options",
  summary: "Get list of issued options",
  description: "Get list of issued options for a company",
  tags: ["Options"],
  request: {
    params: ParamsSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Retrieve the options for the company",
    },
    ...ErrorResponses,
  },
});

const getMany = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    const { limit, cursor, total } = c.req.query();

    const { data, meta } = await getPaginatedOptions({
      companyId: company.id,
      take: Number(limit || DEFAULT_PAGINATION_LIMIT),
      cursor,
      total: Number(total),
    });

    return c.json(
      {
        data,
        meta,
      },
      200,
    );
  });
};

export default getMany;
