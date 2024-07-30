import { withCompanyAuth } from "@/server/api/auth";
import {
  ApiError,
  type ErrorCodeType,
  ErrorResponses,
} from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { CreateOptionSchema } from "@/server/api/schema/option";
import {
  OptionSchema,
  type TCreateOptionSchema,
} from "@/server/api/schema/option";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { addOption } from "@/server/services/stock-option/add-option";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

const ParamsSchema = z.object({
  id: z
    .string()
    .cuid()
    .openapi({
      description: "Company ID",
      param: {
        name: "id",
        in: "path",
      },

      example: "clycjihpy0002c5fzcyf4gjjc",
    }),
});

const ResponseSchema = z.object({
  message: z.string(),
  data: OptionSchema,
});

const route = createRoute({
  method: "post",
  path: "/v1/companies/{id}/options",
  summary: "Issue a new stock option",
  description: "Issue stock option to a stakeholder in a company.",
  tags: ["Options"],
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
      description: "Issue options to stakeholders",
    },
    ...ErrorResponses,
  },
});

const create = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, member, user } = await withCompanyAuth(c);
    const body = await c.req.json();

    const { success, message, data, code } = await addOption({
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      data: body as TCreateOptionSchema,
      companyId: company.id,
      memberId: member.id,
      user: {
        id: user.id,
        name: user.name || "",
      },
    });

    if (!success || !data) {
      throw new ApiError({
        code: code as ErrorCodeType,
        message,
      });
    }

    return c.json(
      {
        message,
        data,
      },
      200,
    );
  });
};

export default create;
