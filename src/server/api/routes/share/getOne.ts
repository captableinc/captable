import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";
import { ShareSchema, type ShareSchemaType } from "../../schema/shares";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Share ID",
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
  data: ShareSchema,
});

export const getOne = withAuthApiV1
  .createRoute({
    summary: "Get Issued Share",
    description: "Fetch a single issued share record by its ID.",
    tags: ["Shares"],
    method: "get",
    path: "/v1/{companyId}/shares/{id}",
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
        description: "Details of the requested issued share.",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const { id } = c.req.valid("param");

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
