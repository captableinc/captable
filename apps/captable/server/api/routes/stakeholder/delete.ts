import { and, db, eq, stakeholders } from "@captable/db";
import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

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
  message: z.string(),
});

export const _delete = withAuthApiV1
  .createRoute({
    summary: "Delete a stakeholder",
    description: "Remove a stakeholder from a company by ID.",
    tags: ["Stakeholder"],
    method: "delete",
    path: "/v1/{companyId}/stakeholders/{id}",
    middleware: [authMiddleware()],
    request: { params: ParamsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Confirmation that the stakeholder has been removed.",
      },
    },
  })
  .handler(async (c) => {
    const { audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client;
    const { id } = c.req.valid("param");

    await db.transaction(async (tx) => {
      const [stakeholder] = await tx
        .select({
          id: stakeholders.id,
          companyId: stakeholders.companyId,
          name: stakeholders.name,
        })
        .from(stakeholders)
        .where(
          and(
            eq(stakeholders.id, id),
            eq(stakeholders.companyId, membership.companyId),
          ),
        )
        .limit(1);

      if (!stakeholder) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: "No stakeholder with the provided Id",
        });
      }

      await tx.delete(stakeholders).where(eq(stakeholders.id, stakeholder.id));

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
          summary: `${membership.user?.name || "User"} deleted the stakeholder ${stakeholder.name} - ${stakeholder.id}`,
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
