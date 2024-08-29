import { z } from "@hono/zod-openapi";
import { ConvertibleNoteSchemaWithStakeHolder } from "../../schema/convertible-note";
import {
  PaginationQuerySchema,
  PaginationResponseSchema,
} from "../../schema/pagination";
import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  data: z.array(ConvertibleNoteSchemaWithStakeHolder),
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
    summary: "List convertible notes",
    description:
      "Retrieve a paginated list of all convertible notes in the company.",
    tags: ["Convertible Notes"],
    method: "get",
    path: "/v1/{companyId}/convertible-notes",
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
        description:
          "A list of convertible notes in a company with their details.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const { db } = c.get("services");
    const query = c.req.valid("query");

    const [data, meta] = await db.convertibleNote
      .paginate({
        where: { companyId: membership.companyId },
        include: { stakeholder: { select: { name: true } } },
      })
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
      data: data.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        issueDate: note.issueDate.toISOString(),
        boardApprovalDate: note.boardApprovalDate.toISOString(),
      })),
      meta,
    };

    return c.json(response, 200);
  });
