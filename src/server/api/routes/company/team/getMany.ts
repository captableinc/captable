import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

import { withCompanyAuth } from "@/server/api/auth";
import { db } from "@/server/db";

export const ResponseSchema = z
  .array(
    z.object({
      id: z.string().cuid().openapi({
        description: "Company ID",
        example: "clxwbok580000i7nge8nm1ry0",
      }),
    }),
  )
  .openapi("Company");

const route = createRoute({
  method: "get",
  path: "/v1/companies/:id/team-members",
  responses: {
    200: {
      description: "List all team members in a company",
    },

    ...ErrorResponses,
  },
});

const getMany = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const id = c.req.param("id");

    await withCompanyAuth(id, c.req.header);

    const members = await db.member.findMany({
      where: {
        companyId: id,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return c.json({ members });
  });
};

export default getMany;
