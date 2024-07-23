import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import {
  ShareSchema,
  type ShareSchemaType,
  UpdateShareSchema,
} from "../../schema/shares";

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
    message: z.string(),
    data: ShareSchema,
  })
  .openapi({
    description: "Update a Share by ID",
  });

export const update = withAuthApiV1
  .createRoute({
    summary: "Update issued shares by ID",
    description: "Update issued shares by share ID",
    tags: ["Shares"],
    method: "patch",
    path: "/v1/stakeholders/{id}",
    request: {
      params: paramsSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateShareSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: responseSchema,
          },
        },
        description: "Update the Share by ID",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = c.get("info");
    const { id } = c.req.valid("param");

    const body = c.req.valid("json");

    const updatedShare = await db.$transaction(async (tx) => {
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

      const updatedShare = await tx.share.update({
        where: {
          id: share.id,
        },
        data: body,
      });

      await audit.create(
        {
          action: "share.updated",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            userAgent: userAgent,
            requestIp: requestIp,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${membership.user.name} updated share the share ID ${updatedShare.id}`,
        },
        tx,
      );

      return updatedShare;
    });

    const data: ShareSchemaType = {
      ...updatedShare,
      createdAt: updatedShare.createdAt.toISOString(),
      updatedAt: updatedShare.updatedAt.toISOString(),
      issueDate: updatedShare.issueDate.toISOString(),
      rule144Date: updatedShare.rule144Date?.toISOString(),
      vestingStartDate: updatedShare.vestingStartDate?.toISOString(),
      boardApprovalDate: updatedShare.boardApprovalDate?.toISOString(),
    };

    return c.json(
      {
        message: "Stakeholder updated successfully",
        data,
      },
      200,
    );
  });
