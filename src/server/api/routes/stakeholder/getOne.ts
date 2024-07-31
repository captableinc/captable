import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";
import {
  StakeholderSchema,
  type TStakeholderSchema,
} from "../../schema/stakeholder";
import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Stakeholder ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
  companyId: z.string().openapi({
    param: {
      name: "companyId",
      in: "path",
    },
    description: "Company ID",
    type: "string",
    example: "clxwbok580000i7nge8nm1ry0",
  }),
});

const ResponseSchema = z.object({
  data: StakeholderSchema,
});

export const getOne = withAuthApiV1
  .createRoute({
    summary: "Retrieve Stakeholder",
    description: "Fetch details of a single stakeholder by their ID.",
    tags: ["Stakeholder"],
    method: "get",
    path: "/v1/{companyId}/stakeholders/{id}",
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Details of the requested stakeholder.",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const { id } = c.req.valid("param");

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
