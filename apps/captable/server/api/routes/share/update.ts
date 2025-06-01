import { and, db, eq, shares } from "@captable/db";
import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import {
  ShareSchema,
  type ShareSchemaType,
  UpdateShareSchema,
} from "../../schema/shares";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Share ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
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

const ResponseSchema = z.object({
  message: z.string(),
  data: ShareSchema,
});

export const update = withAuthApiV1
  .createRoute({
    summary: "Update Issued Shares",
    description: "Update details of an issued share by its ID.",
    tags: ["Shares"],
    method: "patch",
    path: "/v1/{companyId}/stakeholders/{id}",
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateShareSchema,
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
        description: "Confirmation of updated issued share details.",
      },
    },
  })
  .handler(async (c) => {
    const { audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client;
    const { id } = c.req.valid("param");

    const body = c.req.valid("json");

    const updatedShare = await db.transaction(async (tx) => {
      const shareResult = await tx
        .select()
        .from(shares)
        .where(
          and(eq(shares.id, id), eq(shares.companyId, membership.companyId)),
        )
        .limit(1);

      const share = shareResult[0];

      if (!share) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: `No share with the provided Id ${id}`,
        });
      }

      // Convert string dates to Date objects for database
      const {
        issueDate,
        rule144Date,
        vestingStartDate,
        boardApprovalDate,
        ...bodyWithoutDates
      } = body;

      const updateData = {
        ...bodyWithoutDates,
        updatedAt: new Date(),
        ...(issueDate && { issueDate: new Date(issueDate) }),
        ...(rule144Date && { rule144Date: new Date(rule144Date) }),
        ...(vestingStartDate && {
          vestingStartDate: new Date(vestingStartDate),
        }),
        ...(boardApprovalDate && {
          boardApprovalDate: new Date(boardApprovalDate),
        }),
      };

      const updatedShareResult = await tx
        .update(shares)
        .set(updateData)
        .where(eq(shares.id, share.id))
        .returning();

      const updatedShare = updatedShareResult[0];

      if (!updatedShare) {
        throw new ApiError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update share",
        });
      }

      await audit.create(
        {
          action: "share.updated",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            userAgent: userAgent,
            requestIp: requestIp,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${membership.user?.name || "User"} updated share the share ID ${updatedShare.id}`,
        },
        tx,
      );

      return updatedShare;
    });

    if (!updatedShare) {
      throw new ApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update share",
      });
    }

    const data: ShareSchemaType = {
      ...updatedShare,
      createdAt: updatedShare.createdAt.toISOString(),
      updatedAt: updatedShare.updatedAt.toISOString(),
      issueDate: updatedShare.issueDate.toISOString(),
      rule144Date: updatedShare.rule144Date?.toISOString(),
      vestingStartDate: updatedShare.vestingStartDate?.toISOString(),
      boardApprovalDate: updatedShare.boardApprovalDate?.toISOString(),
    };

    return c.json(
      {
        message: "Stakeholder updated successfully",
        data,
      },
      200,
    );
  });
