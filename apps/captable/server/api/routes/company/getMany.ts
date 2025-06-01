import { CompanySchema } from "@/server/api/schema/company";
import { companies, db, eq, inArray, members } from "@captable/db";
import { z } from "@hono/zod-openapi";
import { authMiddleware, withAuthApiV1 } from "../../utils/endpoint-creator";

export const getMany = withAuthApiV1
  .createRoute({
    method: "get",
    path: "/v1/companies",
    tags: ["Company"],
    summary: "List companies",
    description: "Retrieve a list of membership companies.",
    middleware: [authMiddleware({ withoutMembershipCheck: true })],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(CompanySchema),
          },
        },
        description: "A list of companies with their details.",
      },
    },
  })
  .handler(async (c) => {
    const { membership } = c.get("session");

    const userMemberships = await db
      .select({ companyId: members.companyId })
      .from(members)
      .where(eq(members.userId, membership.userId));

    const companyIds = userMemberships.map((item) => item.companyId);

    const companiesResult = await db
      .select()
      .from(companies)
      .where(inArray(companies.id, companyIds));

    return c.json(companiesResult, 200);
  });
