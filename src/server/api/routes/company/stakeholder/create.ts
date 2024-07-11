import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import { StakeholderSchema } from "@/server/api/schema/stakeholder";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { db } from "@/server/db";
import { addStakeholders } from "@/server/services/stakeholder/add-stakeholders";
import type { TypeStakeholderArray } from "@/trpc/routers/stakeholder-router/schema";
import { createRoute, z } from "@hono/zod-openapi";
import { RequestParamsSchema } from "./getMany";

import type { PublicAPI } from "@/server/api/hono";
import { Prisma } from "@prisma/client";
import type { Context } from "hono";

const RequestBodySchema = z
  .array(StakeholderSchema)
  .refine(
    (stakeholders) => {
      const emails = stakeholders.map((stakeholder) => stakeholder.email);
      const uniqueEmails = new Set(emails);
      return uniqueEmails.size === emails.length;
    },
    {
      message: "Please provide unique email to each stakeholder.",
      path: ["email"],
    },
  )
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
    const zodParsed = RequestBodySchema.safeParse(body);

    if (!zodParsed.success) {
      const errorMessage = zodParsed.error.errors.map((err) => err.message);
      throw new ApiError({
        code: "BAD_REQUEST",
        message: String(errorMessage),
      });
    }

    const payload = {
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      user: {
        id: user.id,
        name: user.name as string,
      },
      data: zodParsed.data as TypeStakeholderArray,
    };
    try {
      await addStakeholders({
        db,
        payload,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiError({
            code: "BAD_REQUEST",
            message: "Stakeholder email already exists in database.",
          });
        }
      }
    }

    return c.json({ message: "Stakeholders added successfully" }, 200);
  });
};

export default create;
