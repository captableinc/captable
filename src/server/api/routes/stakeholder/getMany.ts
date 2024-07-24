import { z } from "@hono/zod-openapi";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";
import { StakeholderSchema } from "../../schema/stakeholder";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  data: z.array(StakeholderSchema),
  meta: PaginationResponseSchema,
});

export const getMany = withAuthApiV1
  .createRoute({
    summary: "List All Stakeholders",
    description:
      "Retrieve a paginated list of all stakeholders in the company.",
    tags: ["Stakeholder"],
    method: "get",
    path: "/v1/stakeholders",
    request: {
      query: PaginationQuerySchema,
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
    const { db } = c.get("services");
    const query = c.req.valid("query");

    const [data, meta] = await db.stakeholder
      .paginate({ where: { companyId: membership.companyId } })
      .withCursor({
        limit: query.limit,
        after: query.cursor,
      });

    const response: z.infer<typeof ResponseSchema> = {
      data: data.map((stakeholder) => ({
        ...stakeholder,
        createdAt: stakeholder.createdAt.toISOString(),
        updatedAt: stakeholder.updatedAt.toISOString(),
      })),
      meta,
    };

    return c.json(response, 200);
  });
