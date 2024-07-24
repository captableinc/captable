import { z } from "@hono/zod-openapi";
import {
  paginationQuerySchema,
  paginationResponseSchema,
} from "../../schema/pagination";
import { ShareSchema } from "../../schema/shares";

import { withAuthApiV1 } from "../../utils/endpoint-creator";

const responseSchema = z
  .object({
    data: z.array(ShareSchema),
    meta: paginationResponseSchema,
  })
  .openapi({
    description: "Get Shares by Company ID",
  });

export const getMany = withAuthApiV1
  .createRoute({
    summary: "Get list of issued shares",
    description: "Get list of issued shares for a company",
    tags: ["Shares"],
    method: "get",
    path: "/v1/shares",
    request: {
      query: paginationQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: responseSchema,
          },
        },
        description: "Retrieve the shares for the company",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const { db } = c.get("services");
    const query = c.req.valid("query");

    const [data, meta] = await db.share
      .paginate({ where: { companyId: membership.companyId } })
      .withCursor({
        limit: query.limit,
        after: query.cursor,
      });

    const response: z.infer<typeof responseSchema> = {
      meta,
      data: data.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
        issueDate: i.issueDate.toISOString(),
        rule144Date: i.rule144Date?.toISOString(),
        vestingStartDate: i.vestingStartDate?.toISOString(),
        boardApprovalDate: i.boardApprovalDate?.toISOString(),
      })),
    };

    return c.json(response, 200);
  });
