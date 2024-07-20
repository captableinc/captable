import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { db } from "@/server/db";
import { deleteStakeholder } from "@/server/services/stakeholder/delete-stakeholder";
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
  stakeholderId: z.string().openapi({
    param: {
      name: "stakeholderId",
      in: "path",
    },
    description: "Stakeholder ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
});

const ResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    description: "Delete a stakeholder by ID in a company.",
  });

const route = createRoute({
  summary: "Delete stakeholder",
  description: "Delete a stakeholder by ID in a company.",
  tags: ["Stakeholder"],
  method: "delete",
  path: "/v1/companies/{id}/stakeholders/{stakeholderId}",
  request: { params: RequestParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Delete a stakeholder by ID in a company.",
    },

    ...ErrorResponses,
  },
});

const deleteOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { stakeholderId } = c.req.param();

    const foundStakeholder = await db.stakeholder.findUnique({
      where: {
        id: stakeholderId,
        companyId: company.id,
      },
    });

    if (!foundStakeholder) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "No stakeholder with the provided Id",
      });
    }

    const payload = {
      companyId: company.id,
      stakeholderId: stakeholderId as string,
      user: { id: user.id, name: user.name as string },
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
    };

    await deleteStakeholder(payload);

    return c.json(
      {
        message: "Stakeholder deleted successfully",
      },
      200,
    );
  });
};

export default deleteOne;
