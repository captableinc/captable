import { ApiError } from "@/server/api/error";
import {
  StakeholderSchema,
  type TStakeholderSchema,
  type TUpdateStakeholderSchema,
  UpdateStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";
import { z } from "@hono/zod-openapi";

const ParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Safe ID",
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
  data: StakeholderSchema,
});

export const update = withAuthApiV1
  .createRoute({
    summary: "Update a stakeholder",
    description: "Modify the details of a stakeholder by their ID.",
    tags: ["SAFEs"],
    method: "patch",
    path: "/v1/{companyId}/stakeholders/{id}",
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateStakeholderSchema,
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
        description: "Confirmation of updated stakeholder details.",
      },
    },
  })
  .handler(async (c) => {
    const { id } = c.req.valid("param");
    const { db, audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client as {
      requestIp: string;
      userAgent: string;
    };

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
