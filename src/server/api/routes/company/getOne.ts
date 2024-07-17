import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { ApiCompanySchema } from "@/server/api/schema/company";
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
          schema: ApiCompanySchema,
        },
      },
      description: "Get a company by ID",
    },

    ...ErrorResponses,
  },
} as const);

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = (await withCompanyAuth(c)) as { company: Company };

    if (!company) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }
    const response = {
      ...company,
      logo: company.logo ?? undefined,
      website: company.website ?? undefined,
    };
    return c.json(response, 200);
  });
};

export default getOne;
