import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

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
  message: z.string().openapi({
    description:
      "A text providing details about the API request result, including success, error, or warning messages.",
  }),
});

export const deleteOne = withAuthApiV1
  .createRoute({
    method: "delete",
    path: "/v1/{companyId}/options/{id}",
    summary: "Delete a option",
    description: "Remove an issued option by its ID.",
    tags: ["Options"],
    middleware: [authMiddleware()],
    request: { params: ParamsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Confirmation that the issued option has been removed.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client as {
      requestIp: string;
      userAgent: string;
    };

    const { id } = c.req.valid("param");

    await db.$transaction(async (tx) => {
      const option = await tx.option.findUnique({
        where: {
          id,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          stakeholderId: true,
        },
      });

      if (!option) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: `Option with ID ${id} not found`,
        });
      }

      await tx.option.delete({
        where: {
          id: option.id,
        },
      });

      await audit.create(
        {
          action: "option.deleted",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "option", id }],
          summary: `${membership.user.name} deleted the option for stakeholder ${option.stakeholderId}`,
        },
        tx,
      );
    });

    return c.json(
      {
        message: "Option deleted successfully",
      },
      200,
    );
  });
