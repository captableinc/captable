import { ApiError } from "@/server/api/error";
import { ApiSafeSchema, type ApiSafeType } from "@/server/api/schema/safe";
import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";
import { z } from "@hono/zod-openapi";

const ParamsSchema = z.object({
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
  data: ApiSafeSchema.array(),
});

export const getMany = withAuthApiV1
  .createRoute({
    summary: "List SAFEs",
    description: "List all SAFEs in the company",
    tags: ["SAFEs"],
    method: "get",
    path: "/v1/{companyId}/safes",
    middleware: [authMiddleware()],
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
        description: "Safe details",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { companyId } = c.req.valid("param");

    const safes = (await db.safe.findMany({
      where: {
        companyId,
      },
    })) as ApiSafeType[];

    if (!safes) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "No safe with the provided Id",
      });
    }

    return c.json({ data: safes }, 200);
  });
