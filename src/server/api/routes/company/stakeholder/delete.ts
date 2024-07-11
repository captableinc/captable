import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  StakeholderSchema,
  type TStakeholderSchema,
} from "@/server/api/schema/stakeholder";
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
    data: StakeholderSchema,
  })
  .openapi({
    description: "Delete a stakeholder by ID in a company.",
  });

const route = createRoute({
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

const delete_ = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { stakeholderId } = c.req.param();

    const payload = {
      companyId: company.id,
      stakeholderId: stakeholderId as string,
      user: { id: user.id, name: user.name as string },
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
    };

    const { deletedStakeholder } = await deleteStakeholder({
      db,
      payload,
    });

    return c.json(
      {
        message: "Stakeholder deleted successfully",
        data: deletedStakeholder as unknown as TStakeholderSchema,
      },
      200,
    );
  });
};

export default delete_;
