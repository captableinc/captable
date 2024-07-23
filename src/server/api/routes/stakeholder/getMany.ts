import { z } from "@hono/zod-openapi";
import {
  paginationQuerySchema,
  paginationResponseSchema,
} from "../../schema/pagination";
import {
  type TStakeholderSchema,
  stakeholderSchema,
} from "../../schema/stakeholder";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

const responseSchema = z.object({
  data: z.array(stakeholderSchema),
  meta: paginationResponseSchema,
});

export const getMany = withAuthApiV1
  .createRoute({
    summary: "Get all stakeholders",
    description: "Get all stakeholders with pagination",
    tags: ["Stakeholder"],
    method: "get",
    path: "/v1/stakeholders",
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
        description: "Get paginated stakeholders from a company.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const { db } = c.get("services");
    const query = c.req.valid("query");

    const [data, meta] = await db.stakeholder
      .paginate({ where: { companyId: membership.companyId } })
      .withCursor({
        limit: query.limit,
        after: query.cursor,
      });

    return c.json(
      {
        data: data as unknown as TStakeholderSchema[],
        meta,
      },
      200,
    );
  });
