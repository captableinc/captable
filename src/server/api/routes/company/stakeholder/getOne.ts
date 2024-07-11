import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  StakeholderSchema,
  type TStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { RequestParamsSchema } from "./delete";

const ResponseSchema = z
  .object({
    data: StakeholderSchema,
  })
  .openapi({
    description: "Get a single stakeholder by ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/stakeholders/{stakeholderId}",
  request: { params: RequestParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Get a single stakeholder by ID",
    },

    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    const { stakeholderId } = c.req.param();

    const stakeholder = (await db.stakeholder.findFirst({
      where: {
        id: stakeholderId as string,
        companyId: company.id,
      },
    })) as unknown as TStakeholderSchema;

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
