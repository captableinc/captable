import { withMemberAuth } from "@/server/api/auth";
import { ApiCompanySchema } from "@/server/api/schema/company";
import { z } from "@hono/zod-openapi";
import type { Company } from "@prisma/client";
import { v1Api } from "../../utils/endpoint-creator";

const route = v1Api
  .createRoute({
    method: "get",
    path: "/v1/companies",
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
    const db = c.get("db");
    const { membership } = await withMemberAuth(c);
    const companyIds = membership.map((m) => m.companyId);

    const companies = (await db.company.findMany({
      where: {
        id: {
          in: companyIds,
        },
      },
    })) as Company[];

    const response = companies.map((company) => ({
      ...company,
      logo: company.logo ?? undefined,
      website: company.website ?? undefined,
    }));

    return c.json(response, 200);
  });

export default route;
