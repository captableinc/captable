import { ApiCompanySchema } from "@/server/api/schema/company";
import { z } from "@hono/zod-openapi";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

export const getMany = withAuthApiV1
  .createRoute({
    method: "get",
    path: "/v1/companies",
    tags: ["Company"],
    summary: "Get list of companies",
    description: "Get list of membership companies",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(ApiCompanySchema).openapi({
              description: "List of companies",
            }),
          },
        },
        description: "List companies",
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
