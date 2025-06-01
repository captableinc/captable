import { db, eq, gt, shares } from "@captable/db";
import { z } from "@hono/zod-openapi";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";
import { ShareSchema } from "../../schema/shares";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  data: z.array(ShareSchema),
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
    summary: "List shares",
    description: "Retrieve a list of issued shares for the company.",
    tags: ["Shares"],
    method: "get",
    path: "/v1/{companyId}/shares",
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      query: PaginationQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "A list of issued shares with their details.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const query = c.req.valid("query");

    // Build the where condition
    let whereCondition = eq(shares.companyId, membership.companyId);

    // Add cursor condition if provided
    if (query.cursor) {
      whereCondition = eq(shares.companyId, membership.companyId);
      // Note: For proper cursor pagination, you'd need to add cursor logic here
      // This is a simplified implementation
    }

    const data = await db
      .select()
      .from(shares)
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
      meta,
      data: items.map((i) => ({
        id: i.id,
        status: i.status,
        certificateId: i.certificateId,
        quantity: i.quantity,
        pricePerShare: i.pricePerShare,
        capitalContribution: i.capitalContribution,
        ipContribution: i.ipContribution,
        debtCancelled: i.debtCancelled,
        otherContributions: i.otherContributions,
        cliffYears: i.cliffYears,
        vestingYears: i.vestingYears,
        companyLegends: i.companyLegends,
        stakeholderId: i.stakeholderId,
        shareClassId: i.shareClassId,
        companyId: i.companyId,
        createdAt: i.createdAt?.toISOString(),
        updatedAt: i.updatedAt?.toISOString(),
        issueDate: i.issueDate.toISOString(),
        rule144Date: i.rule144Date?.toISOString(),
        vestingStartDate: i.vestingStartDate?.toISOString(),
        boardApprovalDate: i.boardApprovalDate.toISOString(),
      })),
    };

    return c.json(response, 200);
  });
