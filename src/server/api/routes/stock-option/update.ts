import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import {
  OptionSchema,
  type TOptionSchema,
  UpdateOptionSchema,
} from "@/server/api/schema/option";

import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Option ID",
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
  data: OptionSchema,
});

export const update = withAuthApiV1
  .createRoute({
    summary: "Update Issued Options",
    description: "Update details of an issued option by its ID.",
    tags: ["Options"],
    method: "patch",
    path: "/v1/{companyId}/options/{id}",
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateOptionSchema,
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
        description: "Confirmation of updated issued option details.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client;
    const { id } = c.req.valid("param");

    const body = c.req.valid("json");

    const updatedOption = await db.$transaction(async (tx) => {
      const option = await db.option.findUnique({
        where: {
          id,
          companyId: membership.companyId,
        },
      });

      if (!option) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: `No option with the provided Id ${id}`,
        });
      }

      const updatedOption = await tx.option.update({
        where: {
          id: option.id,
        },
        data: body,
      });

      await audit.create(
        {
          action: "option.updated",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            userAgent: userAgent,
            requestIp: requestIp,
          },
          target: [{ type: "option", id: option.id }],
          summary: `${membership.user.name} updated option the option ID ${updatedOption.id}`,
        },
        tx,
      );

      return updatedOption;
    });

    const data: TOptionSchema = {
      ...updatedOption,
      createdAt: updatedOption.createdAt.toISOString(),
      updatedAt: updatedOption.updatedAt.toISOString(),
      issueDate: updatedOption.issueDate.toISOString(),
      expirationDate: updatedOption.expirationDate.toISOString(),
      rule144Date: updatedOption.rule144Date.toISOString(),
      vestingStartDate: updatedOption.vestingStartDate.toISOString(),
      boardApprovalDate: updatedOption.boardApprovalDate.toISOString(),
    };

    return c.json(
      {
        message: "Option updated successfully",
        data,
      },
      200,
    );
  });
