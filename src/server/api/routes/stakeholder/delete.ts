import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import { withAuthApiV1 } from "../../utils/endpoint-creator";

const paramsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "stakeholderId",
      in: "path",
    },
    description: "Stakeholder ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
});

const responseSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    description: "Delete a stakeholder by ID in a company.",
  });

export const _delete = withAuthApiV1
  .createRoute({
    summary: "Delete stakeholder",
    description: "Delete a stakeholder by ID in a company.",
    tags: ["Stakeholder"],
    method: "delete",
    path: "/v1/stakeholders/{id}",
    request: { params: paramsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: responseSchema,
          },
        },
        description: "Delete a stakeholder by ID in a company.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = c.get("info");
    const { id } = c.req.param();

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
