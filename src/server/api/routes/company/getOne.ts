import { ApiError } from "@/server/api/error";
import { ApiCompanySchema } from "@/server/api/schema/company";
import { z } from "@hono/zod-openapi";

import { withAuthApiV1 } from "../../utils/endpoint-creator";

export const RequestSchema = z.object({
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
});

export const getOne = withAuthApiV1
  .createRoute({
    method: "get",
    path: "/v1/companies/:id",
    request: { params: RequestSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ApiCompanySchema,
          },
        },
        description: "Get a company by ID",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");
    const companyId = c.req.param("id");

    const member = await db.member.findFirst({
      where: { companyId, id: membership.memberId },
      select: { companyId: true },
    });

    if (!member) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: `user is not a member of the company id:${companyId}`,
      });
    }

    const company = await db.company.findFirstOrThrow({
      where: {
        id: member.companyId,
      },
    });
    return c.json(company, 200);
  });
