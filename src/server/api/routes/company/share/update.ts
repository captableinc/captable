import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { UpdateShareSchema } from "@/server/api/schema/shares";
import { updateShare } from "@/server/services/shares/updateShare";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

const ParamsSchema = z
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
    data: z.string(),
  })
  .openapi({
    description: "Update a Share by ID",
  });

const route = createRoute({
  method: "put",
  path: "/v1/companies/{id}/shares/{shareId}",
  request: {
    params: ParamsSchema,
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
    const { company, user, member } = await withCompanyAuth(c);

    const { shareId: id } = c.req.param();

    const body = await c.req.json();
    const requestIP =
      c.req.header("x-forwarded-for") ||
      c.req.header("remoteAddr") ||
      "Unknown IP";
    const userAgent = c.req.header("User-Agent") || "";

    const { success, message } = await updateShare({
      ...body,
      companyId: company.id,
      memberId: member.id,
      requestIP,
      userAgent,
      userId: user.id,
      userName: user.name,
      shareId: id,
    });

    if (!success) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message,
      });
    }

    return c.json(
      {
        data: "Successfully Updated the Share",
      },
      200,
    );
  });
};

export default getOne;
