import { withCompanyAuth } from "@/server/api/auth";
import { ApiError } from "@/server/api/error";
import { ApiCompanySchema } from "@/server/api/schema/company";
import { z } from "@hono/zod-openapi";
import { v1Api } from "../../utils/endpoint-creator";

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

const route = v1Api
  .createRoute({
    method: "get",
    path: "/v1/companies/:id",
    request: { params: RequestSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ApiCompanySchema,
          },
        },
        description: "Get a company by ID",
      },
    },
  })
  .handler(async (c) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const { company } = (await withCompanyAuth(c)) as { company: any };
    c.req.param("id");
    if (!company) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return c.json(company, 200);
  });

export default route;
