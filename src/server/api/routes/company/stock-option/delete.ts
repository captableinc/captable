import { withCompanyAuth } from "@/server/api/auth";
import {
  ApiError,
  type ErrorCodeType,
  ErrorResponses,
} from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { deleteOption } from "@/server/services/stock-option/delete-option";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { RequestParamsSchema } from "./update";

const ResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    description: "Delete a Option by ID",
  });

const route = createRoute({
  method: "delete",
  path: "/v1/companies/{id}/options/{optionId}",
  summary: "Delete issued options",
  description: "Delete a Option by ID",
  tags: ["Options"],
  request: {
    params: RequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Delete a Option by ID",
    },
    ...ErrorResponses,
  },
});

const deleteOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { optionId: id } = c.req.param();

    const { success, code, message } = await deleteOption({
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      optionId: id as string,
      user: { id: user.id, name: user.name || "" },
    });

    if (!success) {
      throw new ApiError({
        code: code as ErrorCodeType,
        message,
      });
    }

    return c.json(
      {
        message: message,
      },
      200,
    );
  });
};

export default deleteOne;
