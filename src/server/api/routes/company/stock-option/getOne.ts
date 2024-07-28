import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { OptionSchema, type TOptionSchema } from "@/server/api/schema/option";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

const ParamsSchema = z.object({
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
  optionId: z
    .string()
    .cuid()
    .openapi({
      description: "Option ID",
      param: {
        name: "optionId",
        in: "path",
      },

      example: "clyd3i9sw000008ij619eabva",
    }),
});

const ResponseSchema = z
  .object({
    data: OptionSchema,
  })
  .openapi({
    description: "Get a single stock option by ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/options/{optionId}",
  summary: "Get an issued option by ID",
  description: "Get a single issued option record by ID",
  tags: ["Options"],
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Retrieve the option for the company",
    },
    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    // id destructured to companyId and optionId destructured to id
    const { optionId: id } = c.req.param();

    const option = (await db.option.findUnique({
      where: {
        id,
        companyId: company.id,
      },
    })) as unknown as TOptionSchema;

    if (!option) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Option not found",
      });
    }

    return c.json(
      {
        data: option,
      },
      200,
    );
  });
};

export default getOne;
