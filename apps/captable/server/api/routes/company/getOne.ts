import { ApiError } from "@/server/api/error";
import { CompanySchema } from "@/server/api/schema/company";
import { and, companies, db, eq, members } from "@captable/db";
import { z } from "@hono/zod-openapi";

import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

export const RequestSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Company ID",
    type: "string",
    example: "clxwbok580000i7nge8nm1ry0",
  }),
});

const ResponseSchema = z.object({
  data: CompanySchema,
});

export const getOne = withAuthApiV1
  .createRoute({
    method: "get",
    path: "/v1/companies/{id}",
    tags: ["Company"],
    summary: "Get a company",
    description: "Fetch details of a single company by its ID.",
    middleware: [authMiddleware({ withoutMembershipCheck: true })],
    request: { params: RequestSchema },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description: "Details of the requested company.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");
    const { id: companyId } = c.req.valid("param");

    const [member] = await db
      .select({ companyId: members.companyId })
      .from(members)
      .where(
        and(
          eq(members.companyId, companyId),
          eq(members.id, membership.memberId),
        ),
      )
      .limit(1);

    if (!member) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: `user is not a member of the company id:${companyId}`,
      });
    }

    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, member.companyId))
      .limit(1);

    if (!company) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return c.json({ data: company }, 200);
  });
