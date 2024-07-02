import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { StakeholderApiResponseSchema } from "@/server/api/schema/stakeholder";
import { getIp } from "@/server/api/utils";
import { db } from "@/server/db";
import { deleteStakeholder } from "@/server/services/stakeholder/delete-stakeholder";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

export const RequestParamsSchema = z.object({
  id: z
    .string()
    // .cuid()
    .openapi({
      description: "Company ID",
      type: "string",
      param: {
        name: "id",
        in: "path",
      },
      example: "clxwbok580000i7nge8nm1ry0",
    }),

  stakeholderId: z
    .string()
    // .cuid()
    .openapi({
      description: "Stakeholder ID",
      type: "string",
      param: {
        name: "stakeholderId",
        in: "path",
      },
      example: "clxwbok580000i7nge8nm1ry0",
    }),
});

const ResponseSchema = z.object({
  data: StakeholderApiResponseSchema.openapi({
    description: "Delete a stakeholder by ID in a company.",
  }),
});

const route = createRoute({
  method: "delete",
  path: "/v1/companies/:id/stakeholders/:stakeholderId",
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
  //@ts-ignore
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const stakeholderId = c.req.param("stakeholderId");

    const payload = {
      companyId: company.id,
      stakeholderId,
      user: { id: user.id, name: user.name as string },
      requestIp: getIp(c.req),
      userAgent: c.req.header("User-Agent") || "",
    };

    const deletedStakeholder = await deleteStakeholder({
      db,
      payload,
    });

    return c.json({ data: deletedStakeholder }, 200);
  });
};

export default delete_;
