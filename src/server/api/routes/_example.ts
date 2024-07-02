import { ApiErrorResponses } from "@/server/api/error";
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

export const ResponseSchema = z
  .object({
    id: z.string().cuid().openapi({
      description: "Company ID",
      example: "clxwbok580000i7nge8nm1ry0",
    }),
  })
  .openapi("Company");

const route = createRoute({
  method: "get",
  path: "api/v1/companies/:id",
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

    ...ApiErrorResponses,
  },
});
const getOne = (app: PublicAPI) => {
  app.openapi(route, (c: Context) => {
    const params = c.req.param();

    return c.json(
      {
        id: params.id as string,
      },
      200,
    );
  });
};

export default getOne;
export type ResponseSchemaType = z.infer<typeof ResponseSchema>;
