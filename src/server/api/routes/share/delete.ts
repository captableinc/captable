import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

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
  })
  .openapi({
    description: "Delete a Share by ID",
  });

export const _delete = withAuthApiV1
  .createRoute({
    method: "delete",
    path: "/v1/shares/{id}",
    summary: "Delete issued shares",
    description: "Delete a Share by ID",
    tags: ["Shares"],
    request: { params: paramsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: responseSchema,
          },
        },
        description: "Delete a Share by ID",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = c.get("info");
    const { id } = c.req.param();

    await db.$transaction(async (tx) => {
      const share = await tx.share.findUnique({
        where: {
          id,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          stakeholderId: true,
        },
      });

      if (!share) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: `Share with ID ${id} not found`,
        });
      }

      await tx.share.delete({
        where: {
          id: share.id,
        },
      });

      await audit.create(
        {
          action: "share.deleted",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "share", id }],
          summary: `${membership.user.name} Deleted the share for stakeholder ${share.stakeholderId}`,
        },
        tx,
      );
    });

    return c.json(
      {
        message: "Share deleted successfully",
      },
      200,
    );
  });
