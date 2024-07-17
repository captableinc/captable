import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import {
  AddStakeholderSchema,
  type TAddStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { addStakeholders } from "@/server/services/stakeholder/add-stakeholders";
import { createRoute, z } from "@hono/zod-openapi";
import { RequestParamsSchema } from "./getMany";

import type { PublicAPI } from "@/server/api/hono";
import { Prisma } from "@prisma/client";
import type { Context } from "hono";

function blockIdField(stakeholders: TAddStakeholderSchema) {
  const hasIdField = stakeholders.some((stakeholder) => "id" in stakeholder);
  return !hasIdField;
}

function uniqueEmails(stakeholders: TAddStakeholderSchema) {
  const emails = stakeholders.map((stakeholder) => stakeholder.email);
  const uniqueEmails = new Set(emails);
  return uniqueEmails.size === emails.length;
}

const RequestBodySchema = AddStakeholderSchema.refine(blockIdField, {
  message: "Cannot provide 'id' while creating stakeholders.",
  path: ["id"],
})
  .refine(uniqueEmails, {
    message: "Please provide unique email to each stakeholder.",
    path: ["email"],
  })
  .openapi("Add many stakeholders in a company");

const ResponseSchema = z.object({
  message: z.string(),
});

const route = createRoute({
  method: "post",
  path: "/v1/companies/{id}/stakeholders",
  request: {
    params: RequestParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: RequestBodySchema,
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
      description: "Add many stakeholders in a company.",
    },

    ...ErrorResponses,
  },
});

const create = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);

    const body = await c.req.json();

    const payload = {
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      user: {
        id: user.id,
        name: user.name as string,
      },
      data: body as TAddStakeholderSchema,
    };
    try {
      await addStakeholders(payload);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiError({
            code: "BAD_REQUEST",
            message: "Stakeholder email already exists in database.",
          });
        }
      }
      throw new ApiError({
        code: "BAD_REQUEST",
        //@ts-ignore
        message: error.message ?? "Something went out. Please try again later.",
      });
    }

    return c.json({ message: "Stakeholders added successfully" }, 200);
  });
};

export default create;
