import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  DEFAULT_PAGINATION_LIMIT,
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "@/server/api/schema/pagination";
import { TeamMemberSchema } from "@/server/api/schema/team-member";
import { getPaginatedMembers } from "@/server/services/teamMember/get-members";
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
    data: z.array(TeamMemberSchema),
    meta: PaginationResponseSchema,
  })
  .openapi({
    description: "Get Team Members by Company ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/teams",
  summary: "Get list of Team Members",
  description: "Get list of Team Members for a company",
  tags: ["Member"],
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
      description: "Retrieve Team Members for the company",
    },
    ...ErrorResponses,
  },
});

const getMany = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    const { limit, cursor, total } = c.req.query();

    const take = limit;

    const { data, meta } = await getPaginatedMembers({
      companyId: company.id,
      take: Number(take || DEFAULT_PAGINATION_LIMIT),
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
