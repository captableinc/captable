import { OptionSchema } from "@/server/api/schema/option";
import { z } from "@hono/zod-openapi";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  data: z.array(OptionSchema),
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
    summary: "List options",
    description: "Retrieve a list of issued options for the company.",
    tags: ["Options"],
    method: "get",
    path: "/v1/{companyId}/options",
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
        description: "A list of issued options with their details.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const { db } = c.get("services");
    const query = c.req.valid("query");

    // To get rid of parseCursor in each getMany route
    //@TODO(Better to have parsing at server/db in root )
    const [data, meta] = await db.option
      .paginate({ where: { companyId: membership.companyId } })
      .withCursor({
        limit: query.limit,
        after: query.cursor,
        getCursor({ id }) {
          return id;
        },
        parseCursor(cursor) {
          return { id: cursor };
        },
      });

    const response: z.infer<typeof ResponseSchema> = {
      meta,
      data: data.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
        issueDate: i.issueDate.toISOString(),
        expirationDate: i.expirationDate.toISOString(),
        rule144Date: i.rule144Date.toISOString(),
        vestingStartDate: i.vestingStartDate.toISOString(),
        boardApprovalDate: i.boardApprovalDate.toISOString(),
      })),
    };
    return c.json(response, 200);
  });
