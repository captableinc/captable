import { z } from "@hono/zod-openapi";
import {
  type TCreateStakeholderSchema,
  createStakeholderSchema,
  stakeholderSchema,
} from "../../schema/stakeholder";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

const responseSchema = z.object({
  message: z.string(),
  data: z.array(stakeholderSchema.pick({ id: true, name: true })),
});

export const create = withAuthApiV1
  .createRoute({
    method: "post",
    path: "/v1/stakeholders",
    summary: "Create stakeholders",
    description: "Create one or stakeholders account in a company.",
    tags: ["Stakeholder"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: createStakeholderSchema,
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
        description: "create a stakeholder for a company",
      },
    },
  })
  .handler(async (c) => {
    const { db, audit } = c.get("services");
    const { membership } = c.get("session");
    const { requestIp, userAgent } = c.get("info");

    const body = await c.req.json<TCreateStakeholderSchema>();

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

    const data: z.infer<typeof responseSchema>["data"] = stakeholders;

    return c.json(
      {
        data,
        message: "Stakeholders successfully created.",
      },
      200,
    );
  });
