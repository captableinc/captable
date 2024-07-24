import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { ApiDeleteResponseSchema } from "@/server/api/schema/delete";
import { createRoute, z } from "@hono/zod-openapi";
import type { Company } from "@prisma/client";
import type { Context } from "hono";

export const RequestSchema = z.object({
  id: z
    .string()
    .cuid()
    .openapi({
      description: "Company ID",
      param: {
        name: "id",
        in: "path",
      },

      example: "cly405ci60000i7ngbiel3m5l",
    }),

  safeId: z
    .string()
    .cuid()
    .openapi({
      description: "Security ID",
      param: {
        name: "safeId",
        in: "path",
      },

      example: "cly43q7220000i7nggrlj2a8g",
    }),
});

const route = createRoute({
  method: "delete",
  path: "/v1/companies/:id/safes/:safeId",
  request: { params: RequestSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ApiDeleteResponseSchema,
        },
      },
      description: "Delete a SAFE by ID",
    },

    ...ErrorResponses,
  },
});

const deleteOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = (await withCompanyAuth(c)) as { company: Company };

    if (!company) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    // TODO: Implement the logic to delete SAFE by ID
    return c.json(
      {
        success: true,
        message: "Resource successfully deleted",
      },
      200,
    );
  });
};

export default deleteOne;