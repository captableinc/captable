import { z } from "@hono/zod-openapi";
import { ApiError } from "../../error";

import {
  type TStakeholderSchema,
  type TUpdateStakeholderSchema,
  stakeholderSchema,
  updateStakeholderSchema,
} from "../../schema/stakeholder";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

const paramsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Stakeholder ID",
    type: "string",
    example: "clyabgufg004u5tbtnz0r4cax",
  }),
});

const responseSchema = z
  .object({
    message: z.string(),
    data: stakeholderSchema,
  })
  .openapi({
    description: "Update a stakeholder by ID",
  });

export const update = withAuthApiV1
  .createRoute({
    summary: "Update stakeholder",
    description: "Update a stakeholder by Id",
    tags: ["Stakeholder"],
    method: "patch",
    path: "/v1/stakeholders/{id}",
    request: {
      params: paramsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateStakeholderSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: responseSchema,
          },
        },
        description: "Update a stakeholder by Id.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = c.get("info");
    const { id } = c.req.valid("param");

    const body = await c.req.json<TUpdateStakeholderSchema>();

    const updatedStakeHolder = await db.$transaction(async (tx) => {
      const stakeholder = await tx.stakeholder.findUnique({
        where: {
          id,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          companyId: true,
          name: true,
        },
      });

      if (!stakeholder) {
        throw new ApiError({
          code: "NOT_FOUND",
          message: "No stakeholder with the provided Id",
        });
      }

      const updatedStakeHolder = await tx.stakeholder.update({
        where: {
          id: stakeholder.id,
        },
        data: body,
      });

      await audit.create(
        {
          action: "stakeholder.updated",
          companyId: membership.companyId,
          actor: { type: "user", id: membership.userId },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "stakeholder", id: stakeholder.id }],
          summary: `${membership.user.name} updated the stakeholder details in the company : ${updatedStakeHolder.name}`,
        },
        tx,
      );

      return updatedStakeHolder;
    });

    const data: TStakeholderSchema = {
      ...updatedStakeHolder,
      createdAt: updatedStakeHolder.createdAt.toISOString(),
      updatedAt: updatedStakeHolder.updatedAt.toISOString(),
    };

    return c.json(
      {
        message: "Stakeholder updated successfully",
        data,
      },
      200,
    );
  });
