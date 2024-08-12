import { generatePublicId } from "@/common/id";

import { z } from "@hono/zod-openapi";
import {
  ConvertibleNoteSchema,
  CreateConvertibleNotesSchema,
} from "../../schema/convertible-note";
import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";
("../../utils/endpoint-creator");

const ResponseSchema = z.object({
  message: z.string(),
  data: ConvertibleNoteSchema,
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

export const create = withAuthApiV1
  .createRoute({
    method: "post",
    path: "/v1/{companyId}/convertible-notes",
    summary: "Create convertible notes",
    description: "Add convertible notes to a company.",
    tags: ["Convertible Notes"],
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: CreateConvertibleNotesSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description:
          "Confirmation of convertible notes created with relevant details.",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const body = c.req.valid("json");

    const note = await db.convertibleNote.create({
      data: {
        ...body,
        publicId: generatePublicId(),
        companyId: membership.companyId,
      },
    });

    const data: z.infer<typeof ResponseSchema>["data"] = {
      ...note,
      updatedAt: note.updatedAt.toISOString(),
      createdAt: note.createdAt.toISOString(),
      issueDate: note.issueDate.toISOString(),
      boardApprovalDate: note.boardApprovalDate.toISOString(),
    };

    return c.json(
      {
        data,
        message: "Convertible note successfully created.",
      },
      200,
    );
  });
