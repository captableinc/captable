import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { ShareSchema } from "@/server/api/schema/shares";
import { deleteShare } from "@/server/services/shares/delete-share";
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
    description: "Delete a Share by ID",
  });

const ResponseSchema = z
  .object({
    message: z.string(),
    data: ShareSchema.optional(),
  })
  .openapi({
    description: "Delete a Share by ID",
  });

const route = createRoute({
  method: "delete",
  path: "/v1/companies/{id}/shares/{shareId}",
  summary: "Delete issued shares",
  description: "Delete a Share by ID",
  tags: ["Shares"],
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Delete a Share by ID",
    },
    ...ErrorResponses,
  },
});

const deleteOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);

    const { shareId: id } = c.req.param();

    const requestIP =
      c.req.header("x-forwarded-for") ||
      c.req.header("remoteAddr") ||
      "Unknown IP";
    const userAgent = c.req.header("User-Agent") || "";

    const { success, message, share } = await deleteShare({
      companyId: company.id,
      requestIp: requestIP,
      userAgent,
      shareId: id as string,
      user: { id: user.id, name: user.name || "" },
    });

    if (!success && !share) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message,
      });
    }

    return c.json(
      {
        message: "Successfully Deleted the Share",
        data: share,
      },
      200,
    );
  });
};

export default deleteOne;
