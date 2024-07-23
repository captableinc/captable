import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";
import {
  type TStakeholderSchema,
  stakeholderSchema,
} from "../../schema/stakeholder";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

const paramsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Stakeholder ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
});

const responseSchema = z
  .object({
    data: stakeholderSchema,
  })
  .openapi({
    description: "Get a stakeholder by ID",
  });

export const getOne = withAuthApiV1
  .createRoute({
    summary: "Get a stakeholder",
    description: "Get a single stakeholder by ID",
    tags: ["Stakeholder"],
    method: "get",
    path: "/v1/stakeholders/{id}",
    request: {
      params: paramsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: responseSchema,
          },
        },
        description: "Get a single stakeholder by ID",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const { id } = c.req.param();

    const stakeholder = await db.stakeholder.findUnique({
      where: {
        id,
        companyId: membership.companyId,
      },
    });

    if (!stakeholder) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "No stakeholder with the provided Id",
      });
    }

    const data: TStakeholderSchema = {
      ...stakeholder,
      createdAt: stakeholder.createdAt.toISOString(),
      updatedAt: stakeholder.updatedAt.toISOString(),
    };

    return c.json(
      {
        data,
      },
      200,
    );
  });
