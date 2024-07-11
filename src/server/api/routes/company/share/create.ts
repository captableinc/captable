import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { AddShareSchema } from "@/server/api/schema/shares";
import { addShare } from "@/server/services/shares/addShare";
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
  data: z.string(),
});

const route = createRoute({
  method: "post",
  path: "/v1/companies/{id}/shares",
  request: {
    params: ParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: AddShareSchema,
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
      description: "Created the Share Successfully",
    },
    ...ErrorResponses,
  },
});

const create = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, member, user } = await withCompanyAuth(c);

    const body = await c.req.json();

    const requestIP =
      c.req.header("x-forwarded-for") ||
      c.req.header("remoteAddr") ||
      "Unknown IP";
    const userAgent = c.req.header("User-Agent") || "";

    const { success } = await addShare({
      ...body,
      companyId: company.id,
      memberId: member.id,
      requestIP,
      userAgent,
      user: {
        id: user.id,
        name: user.name,
      },
    });

    if (!success) {
      throw new ApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, Please try again Later",
      });
    }

    return c.json(
      {
        data: "Created the Share Successfully",
      },
      200,
    );
  });
};

export default create;
