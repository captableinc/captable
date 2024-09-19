import { OptionSchema, type TOptionSchema } from "@/server/api/schema/option";
import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Option ID",
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
  data: OptionSchema,
});

export const getOne = withAuthApiV1
  .createRoute({
    summary: "Get an option",
    description: "Fetch a single issued option record by its ID.",
    tags: ["Options"],
    method: "get",
    path: "/v1/{companyId}/options/{id}",
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
        description: "Details of the requested issued option.",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const { id } = c.req.valid("param");

    const option = await db.option.findUnique({
      where: {
        id,
        companyId: membership.companyId,
      },
    });

    if (!option) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: `No option with the provided Id ${id}`,
      });
    }

    const data: TOptionSchema = {
      ...option,
      createdAt: option.createdAt.toISOString(),
      updatedAt: option.updatedAt.toISOString(),
      issueDate: option.issueDate.toISOString(),
      expirationDate: option.expirationDate.toISOString(),
      rule144Date: option.rule144Date.toISOString(),
      vestingStartDate: option.vestingStartDate.toISOString(),
      boardApprovalDate: option.boardApprovalDate.toISOString(),
    };

    return c.json(
      {
        data,
      },
      200,
    );
  });
