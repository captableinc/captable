import { generatePublicId } from "@/common/id";
import {
  CreateOptionSchema,
  type TOptionSchema,
} from "@/server/api/schema/option";
import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";
import { Audit } from "@/server/audit";
import { z } from "@hono/zod-openapi";

type AuditPromise = ReturnType<typeof Audit.create>;

const ResponseSchema = z.object({
  message: z.string(),
  data: CreateOptionSchema,
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
    path: "/v1/{companyId}/options",
    summary: "Create options",
    description: "Issue options to a stakeholder in a company.",
    tags: ["Options"],
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: CreateOptionSchema,
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
        description: "Confirmation of options issued with relevant details.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client;

    const { documents, ...rest } = c.req.valid("json");

    const option = await db.$transaction(async (tx) => {
      const option = await tx.option.create({
        data: { ...rest, companyId: membership.companyId },
      });

      let auditPromises: AuditPromise[] = [];

      if (documents && documents.length > 0) {
        const bulkDocuments = documents.map((doc) => ({
          companyId: membership.companyId,
          uploaderId: membership.memberId,
          publicId: generatePublicId(),
          name: doc.name,
          bucketId: doc.bucketId,
          optionId: option.id,
        }));

        const docs = await tx.document.createManyAndReturn({
          data: bulkDocuments,
          skipDuplicates: true,
          select: {
            id: true,
            name: true,
          },
        });

        auditPromises = docs.map((doc) =>
          Audit.create(
            {
              action: "document.created",
              companyId: membership.companyId,
              actor: { type: "user", id: membership.userId },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "document", id: doc.id }],
              summary: `${membership.user.name} created a document while issuing a stock option : ${doc.name}`,
            },
            tx,
          ),
        );
      }

      auditPromises.push(
        audit.create(
          {
            action: "option.created",
            companyId: membership.companyId,
            actor: { type: "user", id: membership.userId },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "option", id: option.id }],
            summary: `${membership.user.name} added option for stakeholder ${option.stakeholderId}`,
          },
          tx,
        ),
      );

      await Promise.all(auditPromises);

      return option;
    });

    const data: TOptionSchema = {
      ...option,
      createdAt: option.createdAt.toISOString(),
      updatedAt: option.updatedAt.toISOString(),
      issueDate: option.issueDate.toISOString(),
      expirationDate: option.expirationDate.toISOString(),
      rule144Date: option.rule144Date.toISOString(),
      vestingStartDate: option.vestingStartDate.toISOString(),
      boardApprovalDate: option.boardApprovalDate.toISOString(),
    };

    return c.json({ message: "Option successfully created.", data }, 200);
  });
