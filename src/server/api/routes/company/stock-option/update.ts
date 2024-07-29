import { withCompanyAuth } from "@/server/api/auth";
import {
  ApiError,
  type ErrorCodeType,
  ErrorResponses,
} from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";

import {
  OptionSchema,
  type TUpdateOptionSchema,
  UpdateOptionSchema,
} from "@/server/api/schema/option";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { updateOption } from "@/server/services/stock-option/update-option";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

export const RequestParamsSchema = z
  .object({
    id: z
      .string()
      .cuid()
      .openapi({
        description: "Company ID",
        param: {
          name: "id",
          in: "path",
        },

        example: "clxwbok580000i7nge8nm1ry0",
      }),
    optionId: z
      .string()
      .cuid()
      .openapi({
        description: "Option ID",
        param: {
          name: "optionId",
          in: "path",
        },

        example: "clyd3i9sw000008ij619eabva",
      }),
  })
  .openapi({
    description: "Update an option by ID",
  });

const ResponseSchema = z
  .object({
    message: z.string(),
    data: OptionSchema,
  })
  .openapi({
    description: "Update an option by ID",
  });

const route = createRoute({
  method: "put",
  path: "/v1/companies/{id}/options/{optionId}",
  summary: "Update an issued option by ID",
  description: "Update issued option by option ID",
  tags: ["Options"],
  request: {
    params: RequestParamsSchema,
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
      description: "Update the option by ID",
    },
    ...ErrorResponses,
  },
});

const update = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { optionId } = c.req.param();
    const body = await c.req.json();

    const payload = {
      optionId: optionId as string,
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      data: body as TUpdateOptionSchema,
      user: {
        id: user.id,
        name: user.name as string,
      },
    };

    const { success, message, code, data } = await updateOption(payload);

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

export default update;
