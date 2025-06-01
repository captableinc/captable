import { db, shares } from "@captable/db";
import { z } from "@hono/zod-openapi";
import {
  CreateShareSchema,
  type CreateShareSchemaType,
} from "../../schema/shares";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ResponseSchema = z.object({
  message: z.string(),
  data: CreateShareSchema,
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
    path: "/v1/{companyId}/shares",
    summary: "Create shares",
    description: "Issue shares to a stakeholder in a company.",
    tags: ["Shares"],
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: CreateShareSchema,
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
        description: "Confirmation of shares issued with relevant details.",
      },
    },
  })
  .handler(async (c) => {
    const { audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client;

    const body = c.req.valid("json");

    const share = await db.transaction(async (tx) => {
      const [share] = await tx
        .insert(shares)
        .values({
          ...body,
          companyId: membership.companyId,
          issueDate: new Date(body.issueDate),
          boardApprovalDate: new Date(body.boardApprovalDate),
          rule144Date: body.rule144Date ? new Date(body.rule144Date) : null,
          vestingStartDate: body.vestingStartDate
            ? new Date(body.vestingStartDate)
            : null,
          updatedAt: new Date(),
        })
        .returning();

      if (!share) {
        throw new Error("Failed to create share");
      }

      // if (documents && documents.length > 0) {
      //   const bulkDocuments = documents.map((doc) => ({
      //     companyId: input.companyId,
      //     uploaderId: input.memberId,
      //     publicId: generatePublicId(),
      //     name: doc.name,
      //     bucketId: doc.bucketId,
      //     shareId: share.id,
      //   }));

      //   await tx.document.createMany({
      //     data: bulkDocuments,
      //     skipDuplicates: true,
      //   });
      // }

      await audit.create(
        {
          action: "share.created",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${membership.user?.name || "User"} added share for stakeholder ${share.stakeholderId}`,
        },
        tx,
      );

      return share;
    });

    const data: CreateShareSchemaType = {
      status: share.status,
      certificateId: share.certificateId,
      quantity: share.quantity,
      pricePerShare: share.pricePerShare,
      capitalContribution: share.capitalContribution,
      ipContribution: share.ipContribution,
      debtCancelled: share.debtCancelled,
      otherContributions: share.otherContributions,
      cliffYears: share.cliffYears,
      vestingYears: share.vestingYears,
      companyLegends: share.companyLegends,
      issueDate: share.issueDate.toISOString(),
      boardApprovalDate: share.boardApprovalDate.toISOString(),
      rule144Date: share.rule144Date?.toISOString(),
      vestingStartDate: share.vestingStartDate?.toISOString(),
      stakeholderId: share.stakeholderId,
      shareClassId: share.shareClassId,
    };

    return c.json({ message: "Share successfully created.", data }, 200);
  });
