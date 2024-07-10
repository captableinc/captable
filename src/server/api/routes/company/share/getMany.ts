import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "@/server/api/schema/pagination";
import { ShareSchema } from "@/server/api/schema/shares";
import { getPaginatedShares } from "@/server/services/shares/getShares";
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
    data: z.array(ShareSchema),
    meta: PaginationResponseSchema,
  })
  .openapi({
    description: "Get Shares by Company ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/shares",
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
      description: "Retrieve the share for the company",
    },
    ...ErrorResponses,
  },
});

const getMany = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    const { limit, cursor, total } = c.req.query();

    const { data, meta } = await getPaginatedShares({
      companyId: company.id,
      limit: Number(limit),
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
