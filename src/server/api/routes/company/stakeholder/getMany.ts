import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "@/server/api/schema/pagination";
import { StakeholderApiResponseSchema } from "@/server/api/schema/stakeholder";
import { db } from "@/server/db";
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
  data: StakeholderApiResponseSchema,
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
      description: "Get a paginated list of stakeholders for a company.",
    },

    ...ErrorResponses,
  },
});

const getMany = (app: PublicAPI) => {
  //@ts-ignore
  app.openapi(route, async (c: Context) => {
    const query = c.req.query();

    const { company } = await withCompanyAuth(c);
    const { data, meta } = await getPaginatedStakeholders({
      db,
      payload: {
        limit: Number(query.limit) ?? 10,
        cursor: query.cursor as string,
        companyId: company.id,
      },
    });

    return c.json({ data, meta }, 200);
  });
};

export default getMany;
