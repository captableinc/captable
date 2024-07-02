import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import { StakeholderApiResponseSchema } from "@/server/api/schema/stakeholder";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";

import type { PublicAPI } from "@/server/api/hono";
import type { Context } from "hono";
import { RequestParamsSchema } from "./delete";

const ResponseSchema = z.object({
  data: StakeholderApiResponseSchema.openapi({
    description: "Get a single stakeholder by ID upper",
  }),
});

const route = createRoute({
  method: "get",
  path: "/v1/companies/:id/stakeholders/:stakeholderId",
  request: { params: RequestParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Get a single stakeholder by ID lower",
    },

    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  //@ts-ignore
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);
    const stakeholderId = "cly4ko2vy000cr5gl0mw8ptc8";
    console.log({ company });

    const stakeholder = await db.stakeholder.findFirst({
      where: {
        id: stakeholderId,
        companyId: company.id,
      },
    });

    if (!stakeholder) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Stakeholder not found",
      });
    }

    return c.json({ data: stakeholder }, 200);
  });
};

export default getOne;
