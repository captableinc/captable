import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  UpdateShareSchema,
  type UpdateShareSchemaType,
} from "@/server/api/schema/shares";
import { getHonoUserAgent, getIp } from "@/server/api/utils";
import { updateShare } from "@/server/services/shares/update-share";
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
    shareId: z
      .string()
      .cuid()
      .openapi({
        description: "Share ID",
        param: {
          name: "shareId",
          in: "path",
        },

        example: "clyd3i9sw000008ij619eabva",
      }),
  })
  .openapi({
    description: "Update a Share by ID",
  });

const ResponseSchema = z
  .object({
    message: z.string(),
    data: UpdateShareSchema,
  })
  .openapi({
    description: "Update a Share by ID",
  });

const route = createRoute({
  method: "put",
  path: "/v1/companies/{id}/shares/{shareId}",
  summary: "Update issued shares by ID",
  description: "Update issued shares by share ID",
  tags: ["Shares"],
  request: {
    params: RequestParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateShareSchema,
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
      description: "Update the Share by ID",
    },
    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const { shareId } = c.req.param();
    const body = await c.req.json();

    const payload = {
      shareId: shareId as string,
      companyId: company.id,
      requestIp: getIp(c.req),
      userAgent: getHonoUserAgent(c.req),
      data: body as UpdateShareSchemaType,
      user: {
        id: user.id,
        name: user.name as string,
      },
    };

    const { success, message, data } = await updateShare(payload);

    if (!success) {
      throw new ApiError({
        code: "NOT_FOUND",
        message,
      });
    }

    return c.json(
      {
        message: message,
        data: {
          ...data,
          issueDate: data?.issueDate.toISOString(), // Convert Date to string
        } as UpdateShareSchemaType,
      },
      200,
    );
  });
};

export default getOne;
