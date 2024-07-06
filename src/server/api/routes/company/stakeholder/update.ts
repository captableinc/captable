import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import {
  StakeholderSchema,
  type TStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import { getIp, getParsedJson } from "@/server/api/utils";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";

import type { PublicAPI } from "@/server/api/hono";
import { updateStakeholder } from "@/server/services/stakeholder/update-stakeholder";
import type { UpdateStakeholderMutationType } from "@/trpc/routers/stakeholder-router/schema";
import type { Context } from "hono";
import { RequestParamsSchema } from "./delete";

const RequestJsonSchema = StakeholderSchema.openapi({
  description: "Update a stakeholder by ID",
});

const ResponseSchema = z
  .object({
    message: z.string(),
    data: StakeholderSchema,
  })
  .openapi({
    description: "Update stakeholder by ID",
  });

const route = createRoute({
  method: "put",
  path: "/v1/companies/{id}/stakeholders/{stakeholderId}",
  request: { params: RequestParamsSchema, json: RequestJsonSchema },
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
    const parsedJson = await getParsedJson(c);
    const zodParsed = RequestJsonSchema.safeParse(parsedJson);

    if (!zodParsed.success) {
      const errorMessage = zodParsed.error.errors.map((err) => err.message);
      throw new ApiError({
        code: "BAD_REQUEST",
        message: String(errorMessage),
      });
    }

    const { id, ...rest } = zodParsed.data;

    const payload = {
      stakeholderId: stakeholderId,
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: c.req.header("User-Agent") || "",
      data: rest as Omit<UpdateStakeholderMutationType, "id">,
      user: {
        id: user.id,
        name: user.name as string,
      },
    };

    const updatedStakeholder = (await updateStakeholder({
      db,
      payload,
    })) as unknown as TStakeholderSchema;

    if (!updatedStakeholder) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "Stakeholder not updated",
      });
    }

    return c.json(
      {
        message: "Stakeholder updated successfully",
        data: updatedStakeholder,
      },
      200,
    );
  });
};

export default update;
