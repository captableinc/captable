import { z } from "@hono/zod-openapi";
import {
  paginationQuerySchema,
  paginationResponseSchema,
} from "../../schema/pagination";
import { ShareSchema, type ShareSchemaType } from "../../schema/shares";

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

    const datas = data as unknown as ShareSchemaType[];

    return c.json(
      {
        data: datas,
        meta,
      },
      200,
    );
  });
