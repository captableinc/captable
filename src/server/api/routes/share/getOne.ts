import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";
import { ShareSchema, type ShareSchemaType } from "../../schema/shares";

import { withAuthApiV1 } from "../../utils/endpoint-creator";

const paramsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Share ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
});

const responseSchema = z
  .object({
    data: ShareSchema,
  })
  .openapi({
    description: "Get a single Share by ID",
  });

export const getOne = withAuthApiV1
  .createRoute({
    summary: "Get an issued share by ID",
    description: "Get a single issued share record by ID",
    tags: ["Shares"],
    method: "get",
    path: "/v1/shares/{id}",
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
        description: "Retrieve the share for the company",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const { id } = c.req.param();

    const share = await db.share.findUnique({
      where: {
        id,
        companyId: membership.companyId,
      },
    });

    if (!share) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: `No share with the provided Id ${id}`,
      });
    }

    const data: ShareSchemaType = {
      ...share,
      createdAt: share.createdAt.toISOString(),
      updatedAt: share.updatedAt.toISOString(),
      issueDate: share.issueDate.toISOString(),
      rule144Date: share.rule144Date?.toISOString(),
      vestingStartDate: share.vestingStartDate?.toISOString(),
      boardApprovalDate: share.boardApprovalDate?.toISOString(),
    };

    return c.json(
      {
        data,
      },
      200,
    );
  });
