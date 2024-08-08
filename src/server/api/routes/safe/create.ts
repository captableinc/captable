import {
  CreateStakeholderSchema,
  StakeholderSchema,
} from "@/server/api/schema/stakeholder";
import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";
import { z } from "@hono/zod-openapi";

const ResponseSchema = z.object({
  message: z.string(),
  data: z.array(StakeholderSchema.pick({ id: true, name: true })),
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
    path: "/v1/{companyId}/stakeholders",
    summary: "Create stakeholders",
    description: "Add one or more stakeholder accounts to a company.",
    tags: ["Stakeholder"],
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: CreateStakeholderSchema,
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
          "Confirmation of stakeholder created with relevant details.",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit, client } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = client as {
      requestIp: string;
      userAgent: string;
    };

    const body = c.req.valid("json");

    const stakeholders = await db.$transaction(async (tx) => {
      const inputDataWithCompanyId = body.map((stakeholder) => ({
        ...stakeholder,
        companyId: membership.companyId,
      }));

      const addedStakeholders = await tx.stakeholder.createManyAndReturn({
        data: inputDataWithCompanyId,
        select: {
          id: true,
          name: true,
        },
      });

      const auditPromises = addedStakeholders.map((stakeholder) =>
        audit.create(
          {
            action: "stakeholder.added",
            companyId: membership.companyId,
            actor: { type: "user", id: membership.userId },
            context: {
              requestIp,
              userAgent,
            },
            target: [{ type: "stakeholder", id: stakeholder.id }],
            summary: `${membership.user.name} added the stakholder in the company : ${stakeholder.name}`,
          },
          tx,
        ),
      );
      await Promise.all(auditPromises);

      return addedStakeholders;
    });

    const data: z.infer<typeof ResponseSchema>["data"] = stakeholders;

    return c.json(
      {
        data,
        message: "Stakeholders successfully created.",
      },
      200,
    );
  });
