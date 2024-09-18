import { z } from "@hono/zod-openapi";
import { OffsetPaginationResponseSchema } from "../../schema/pagination";
import {
  ManyStakeholderQuerySchema,
  StakeholderSchema,
  parseManyStakeholderSortParam,
} from "../../schema/stakeholder";
import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  data: z.array(StakeholderSchema),
  meta: OffsetPaginationResponseSchema,
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
      query: ManyStakeholderQuerySchema,
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
    const { db } = c.get("services");
    const { limit, page, sort, name: query } = c.req.valid("query");

    const [data, meta] = await db.stakeholder
      .paginate({
        where: {
          companyId: membership.companyId,
          ...(query && {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }),
        },
        orderBy: parseManyStakeholderSortParam(sort),
      })
      .withPages({
        includePageCount: true,
        limit,
        page,
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
