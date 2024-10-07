import { SafeSchema, type TSafeSchema } from "@/server/api/schema/safe";
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
  data: z.array(SafeSchema),
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
    const { membership } = c.get("session");

    const safes = await db.safe.findMany({
      where: {
        companyId: membership.companyId,
      },
    });

    const data: TSafeSchema[] = safes.map((safe) => ({
      ...safe,
      createdAt: new Date(safe.createdAt).toISOString(),
      updatedAt: new Date(safe.updatedAt).toISOString(),
      issueDate: new Date(safe.issueDate).toISOString(),
      boardApprovalDate: safe.boardApprovalDate
        ? new Date(safe.boardApprovalDate).toISOString()
        : safe.boardApprovalDate,
    }));

    return c.json({ data }, 200);
  });
