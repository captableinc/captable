import { ApiError } from "@/server/api/error";
import { z } from "@hono/zod-openapi";

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
    description: "Safe ID",
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
  message: z.string(),
});

export const _delete = withAuthApiV1
  .createRoute({
    summary: "Delete a SAFE",
    description: "Remove a SAFE from a company by ID.",
    tags: ["SAFEs"],
    method: "delete",
    path: "/v1/{companyId}/safes/{id}",
    middleware: [authMiddleware()],
    request: { params: ParamsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Confirmation that the safe has been removed.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client;
    const { id } = c.req.valid("param");

    await db.$transaction(async (tx) => {
      const stakeholder = await tx.stakeholder.findUnique({
        where: {
          id,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          companyId: true,
          name: true,
        },
      });

      if (!stakeholder) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: "No stakeholder with the provided Id",
        });
      }

      await tx.stakeholder.delete({
        where: {
          id: stakeholder.id,
        },
      });

      await audit.create(
        {
          action: "stakeholder.deleted",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "stakeholder", id }],
          summary: `${membership.user.name} deleted the stakeholder ${stakeholder.name} - ${stakeholder.id}`,
        },
        tx,
      );
    });

    return c.json(
      {
        message: "Stakeholder deleted successfully",
      },
      200,
    );
  });
