import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  StakeholderSchema,
  type TStakeholderSchema,
  type TUpdateStakeholderSchema,
  UpdateStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { db } from "@/server/db";
import { updateStakeholder } from "@/server/services/stakeholder/update-stakeholder";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { RequestParamsSchema } from "./delete";

const ResponseSchema = z
  .object({
    message: z.string(),
    data: StakeholderSchema,
  })
  .openapi({
    description: "Update a stakeholder by ID",
  });

const route = createRoute({
  summary: "Update stakeholder",
  description: "Update a stakeholder by ID",
  tags: ["Stakeholder"],
  method: "put",
  path: "/v1/companies/{id}/stakeholders/{stakeholderId}",
  request: {
    params: RequestParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateStakeholderSchema,
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
      description: "Update stakeholder in a company",
    },

    ...ErrorResponses,
  },
});

const update = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);

    const params = c.req.param();
    const stakeholderId = params.stakeholderId as string;

    const body = await c.req.json();

    const foundStakeholder = await db.stakeholder.findFirst({
      where: {
        id: stakeholderId,
      },
    });

    if (!foundStakeholder) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "No stakeholder with provided id",
      });
    }

    const payload = {
      stakeholderId: stakeholderId,
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      data: body as TUpdateStakeholderSchema,
      user: {
        id: user.id,
        name: user.name as string,
      },
    };

    const { updatedStakeholder } = await updateStakeholder(payload);

    if (!updatedStakeholder) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "Stakeholder not updated.",
      });
    }

    return c.json(
      {
        message: "Stakeholder updated successfully",
        data: updatedStakeholder as unknown as TStakeholderSchema,
      },
      200,
    );
  });
};

export default update;
