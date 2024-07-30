import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { TeamMemberSchema } from "@/server/api/schema/team-member";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

const RequestParamsSchema = z.object({
  id: z
    .string()
    .cuid()
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      description: "Company ID",
      type: "string",
      example: "clytvs95t0002mhgjmkc8rtve",
    }),
  memberId: z
    .string()
    .cuid()
    .openapi({
      param: {
        name: "memberId",
        in: "path",
      },
      description: "Team Member ID",
      type: "string",
      example: "clytvs9gj0008mhgje2129y6g",
    }),
});

const ResponseSchema = z
  .object({
    data: TeamMemberSchema,
  })
  .openapi({
    description: "Get a single Team Member by ID",
  });

const route = createRoute({
  summary: "Get a Team Member",
  description: "Get a single Team Member by ID",
  tags: ["Member"],
  method: "get",
  path: "/v1/companies/{id}/teams/{memberId}",
  request: { params: RequestParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Get a single Team Member by ID",
    },

    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    await withCompanyAuth(c);

    const { memberId } = c.req.param();

    const teamMember = await db.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!teamMember) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Team member not found",
      });
    }

    return c.json({ data: teamMember }, 200);
  });
};

export default getOne;
