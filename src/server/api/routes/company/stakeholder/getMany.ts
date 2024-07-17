import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "@/server/api/schema/pagination";
import {
  StakeholderSchema,
  type TStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import { getPaginatedStakeholders } from "@/server/services/stakeholder/get-stakeholders";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

export const RequestParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Company ID",
    type: "string",
    example: "clxwbok580000i7nge8nm1ry0",
  }),
});

const ResponseSchema = z.object({
  data: z.array(StakeholderSchema),
  meta: PaginationResponseSchema,
});

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/stakeholders",
  request: {
    params: RequestParamsSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Get paginated stakeholders from a company.",
    },
    ...ErrorResponses,
  },
});

const getMany = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);
    const query = c.req.query();

    const { data, meta } = await getPaginatedStakeholders({
      take: Number(query.limit) || 10,
      cursor: query?.cursor,
      companyId: company.id,
    });

    return c.json(
      {
        data: data as unknown as TStakeholderSchema[],
        meta,
      },
      200,
    );
  });
};

export default getMany;
