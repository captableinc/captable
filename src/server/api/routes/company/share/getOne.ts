import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { ShareSchema, type TShareSchema } from "@/server/api/schema/shares";
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
  shareId: z
    .string()
    .cuid()
    .openapi({
      description: "Share ID",
      param: {
        name: "shareId",
        in: "path",
      },

      example: "clyd3i9sw000008ij619eabva",
    }),
});

const ResponseSchema = z
  .object({
    data: ShareSchema,
  })
  .openapi({
    description: "Get a single Share by ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/shares/{shareId}",
  summary: "Get an issued share by ID",
  description: "Get a single issued share record by ID",
  tags: ["Shares"],
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
      description: "Retrieve the share for the company",
    },
    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    // id destructured to companyId and shareId destructured to id
    const { shareId: id } = c.req.param();

    const share = (await db.share.findUnique({
      where: {
        id,
        companyId: company.id,
      },
    })) as unknown as TShareSchema;

    if (!share) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Share not found",
      });
    }

    return c.json(
      {
        data: share,
      },
      200,
    );
  });
};

export default getOne;
