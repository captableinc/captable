import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import {
  type DeleteMemberPayload,
  deleteMember,
} from "@/server/services/team-members/delete-member";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { RequestParamsSchema } from "./update";

const ResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    description: "Delete a Team Member by ID",
  });

const DeleteParamsSchema = RequestParamsSchema.openapi({
  description: "Delete a Team Member by ID",
});

const route = createRoute({
  method: "delete",
  path: "/v1/companies/{id}/teams/{memberId}",
  summary: "Delete a Team Member by ID",
  description: "Delete a Team Member by ID",
  tags: ["Member"],
  request: {
    params: DeleteParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Delete a Share by ID",
    },
    ...ErrorResponses,
  },
});

const deleteOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { memberId } = c.req.param();

    const payload: DeleteMemberPayload = {
      companyId: company.id,
      memberId: memberId as string,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      user: {
        id: user.id,
        name: user.name as string,
      },
    };

    const { success, message } = await deleteMember(payload);

    if (!success) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message,
      });
    }

    return c.json(
      {
        message: message,
      },
      200,
    );
  });
};

export default deleteOne;
