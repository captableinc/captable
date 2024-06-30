import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { createRoute, z } from "@hono/zod-openapi";
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

      example: "clxwbok580000i7nge8nm1ry0",
    }),
});

export const ResponseSchema = z.object({
  id: z.string().cuid().openapi({
    description: "Company ID",
    example: "clxwbok580000i7nge8nm1ry0",
  }),
});

const route = createRoute({
  method: "get",
  path: "/v1/companies/:id",
  request: { params: RequestSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Get a company by ID",
    },

    ...ErrorResponses,
  },
});
const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    if (!company) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return c.json(
      {
        id: company.id,
      },
      200,
    );
  });
};

export default getOne;
export type ResponseSchemaType = z.infer<typeof ResponseSchema>;
