import { CompanySchema } from "@/server/api/schema/company";
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
    const { db } = c.get("services");
    const { membership } = c.get("session");

    const userMemberships = await db.member.findMany({
      where: { userId: membership.userId },
      select: { companyId: true },
    });

    const companies = await db.company.findMany({
      where: {
        id: { in: userMemberships.map((item) => item.companyId) },
      },
    });

    return c.json(companies, 200);
  });
