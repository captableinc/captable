import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, type ErrorCode, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  UpdateMemberSchema,
  type UpdateMemberType,
} from "@/server/api/schema/team-member";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import {
  type UpdateMemberPayloadType,
  updateMember,
} from "@/server/services/team-members/update-member";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

export const RequestParamsSchema = z
  .object({
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
    memberId: z
      .string()
      .cuid()
      .openapi({
        description: "Team Member ID",
        param: {
          name: "memberId",
          in: "path",
        },

        example: "clyd3i9sw000008ij619eabva",
      }),
  })
  .openapi({
    description: "Update a Team Member by ID",
  });

const ResponseSchema = z
  .object({
    message: z.string(),
    data: UpdateMemberSchema,
  })
  .openapi({
    description: "Update a Team Member by ID",
  });

const route = createRoute({
  method: "put",
  path: "/v1/companies/{id}/teams/{memberId}",
  summary: "Update a Team Member by ID",
  description: "Update a Team Member by ID",
  tags: ["Member"],
  request: {
    params: RequestParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateMemberSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Update a Team Member by ID",
    },
    ...ErrorResponses,
  },
});

const update = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { memberId } = c.req.param();
    const body = await c.req.json();

    const payload: UpdateMemberPayloadType = {
      memberId: memberId as string,
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      data: body as UpdateMemberType,
      user: {
        id: user.id,
        name: user.name as string,
      },
    };

    const result = await updateMember(payload);
    const { success, data } = result;
    const code = result.code as z.infer<typeof ErrorCode>;

    if (!success) {
      throw new ApiError({
        code,
        message: result.message,
      });
    }

    return c.json(
      {
        message: result.message,
        data: data as UpdateMemberType,
      },
      200,
    );
  });
};

export default update;
