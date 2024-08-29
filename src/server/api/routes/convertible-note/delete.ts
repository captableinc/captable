import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "convertible note ID",
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

export const deleteOne = withAuthApiV1
  .createRoute({
    summary: "Delete a convertible note",
    description: "Remove a convertible note from a company by ID.",
    tags: ["Convertible Notes"],
    method: "delete",
    path: "/v1/{companyId}/convertible-notes/{id}",
    middleware: [authMiddleware()],
    request: { params: ParamsSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Confirmation that the convertible note has been removed.",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const { id } = c.req.valid("param");

    await db.$transaction(async (tx) => {
      const note = await tx.convertibleNote.findUnique({
        where: {
          id,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          companyId: true,
        },
      });

      if (!note) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: "No convertible note with the provided Id",
        });
      }

      await tx.convertibleNote.delete({
        where: {
          id: note.id,
        },
      });
    });

    return c.json(
      {
        message: "Convertible Note deleted successfully",
      },
      200,
    );
  });
