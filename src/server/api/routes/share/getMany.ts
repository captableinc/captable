import { getPaginatedShares } from "@/server/services/shares/get-shares";
import { z } from "@hono/zod-openapi";
import {
  DEFAULT_PAGINATION_LIMIT,
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";
import { ShareSchema, type ShareSchemaType } from "../../schema/shares";

import { withAuthApiV1 } from "../../utils/endpoint-creator";

const responseSchema = z
  .object({
    data: z.array(ShareSchema),
    meta: PaginationResponseSchema,
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
      query: PaginationQuerySchema,
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

    const { take, cursor, total } = c.req.query();

    const { data, meta } = await getPaginatedShares({
      companyId: membership.companyId,
      take: Number(take || DEFAULT_PAGINATION_LIMIT),
      cursor,
      total: Number(total),
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
