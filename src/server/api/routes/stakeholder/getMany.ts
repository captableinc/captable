import { getPaginatedStakeholders } from "@/server/services/stakeholder/get-stakeholders";
import { z } from "@hono/zod-openapi";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";
import {
  type TStakeholderSchema,
  stakeholderSchema,
} from "../../schema/stakeholder";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

const responseSchema = z.object({
  data: z.array(stakeholderSchema),
  meta: PaginationResponseSchema,
});

export const getMany = withAuthApiV1
  .createRoute({
    summary: "Get all stakeholders",
    description: "Get all stakeholders with pagination",
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
            schema: responseSchema,
          },
        },
        description: "Get paginated stakeholders from a company.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const query = c.req.query();

    const { data, meta } = await getPaginatedStakeholders({
      take: Number(query.limit) || 10,
      cursor: query?.cursor,
      companyId: membership.companyId,
    });

    return c.json(
      {
        data: data as unknown as TStakeholderSchema[],
        meta,
      },
      200,
    );
  });
