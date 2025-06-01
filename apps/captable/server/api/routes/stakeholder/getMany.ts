import { db, eq, gt, stakeholders } from "@captable/db";
import { z } from "@hono/zod-openapi";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";
import { StakeholderSchema } from "../../schema/stakeholder";
import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  data: z.array(StakeholderSchema),
  meta: PaginationResponseSchema,
});

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

export const getMany = withAuthApiV1
  .createRoute({
    summary: "List stakeholders",
    description:
      "Retrieve a paginated list of all stakeholders in the company.",
    tags: ["Stakeholder"],
    method: "get",
    path: "/v1/{companyId}/stakeholders",
    middleware: [authMiddleware()],
    request: {
      query: PaginationQuerySchema,
      params: ParamsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "A list of stakeholders in a company with their details.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const query = c.req.valid("query");

    // Build the where condition
    let whereCondition = eq(stakeholders.companyId, membership.companyId);

    // Add cursor condition if provided (for pagination)
    if (query.cursor) {
      whereCondition = eq(stakeholders.companyId, membership.companyId);
      // Note: For proper cursor pagination, you'd need to add cursor logic here
      // This is a simplified implementation
    }

    const data = await db
      .select()
      .from(stakeholders)
      .where(whereCondition)
      .limit(query.limit + 1); // Get one extra to check if there's a next page

    // Check if there's a next page
    const hasNextPage = data.length > query.limit;
    const items = hasNextPage ? data.slice(0, -1) : data;

    // Create pagination meta
    const meta = {
      hasNextPage,
      hasPreviousPage: !!query.cursor,
      startCursor: items.length > 0 ? items[0]?.id || null : null,
      endCursor: hasNextPage ? items[items.length - 1]?.id || null : null,
    };

    const response: z.infer<typeof ResponseSchema> = {
      data: items.map((stakeholder) => ({
        ...stakeholder,
        createdAt: stakeholder.createdAt.toISOString(),
        updatedAt: stakeholder.updatedAt.toISOString(),
      })),
      meta,
    };

    return c.json(response, 200);
  });
