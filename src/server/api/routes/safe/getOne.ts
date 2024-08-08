import { ApiError } from "@/server/api/error";
import { ApiSafeSchema, type ApiSafeType } from "@/server/api/schema/safe";
import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";
import { z } from "@hono/zod-openapi";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Safe ID",
    type: "string",
    example: "clzkure8d0000f1ng0hrv9fg9",
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
  data: ApiSafeSchema,
});

export const getOne = withAuthApiV1
  .createRoute({
    summary: "Get a SAFE",
    description: "Get a SAFE by ID",
    tags: ["SAFEs"],
    method: "get",
    path: "/v1/{companyId}/safes/{id}",
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
    const { membership } = c.get("session");
    const { id } = c.req.valid("param");

    const safe = (await db.safe.findUnique({
      where: {
        id,
        companyId: membership.companyId,
      },
    })) as ApiSafeType | null;

    if (!safe) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: `SAFE with id ${id} could not be found`,
      });
    }

    return c.json({ data: safe }, 200);
  });
