import { withCompanyAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { db } from "@/server/db";
import { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";

const route = createRoute({
  method: "get",
  path: "/v1/companies/:id/team-members/:memberId",
  responses: {
    200: {
      description: "Get a team member by ID or email in a company.",
    },

    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const id = c.req.param("id");
    const memberId = c.req.param("memberId");

    await withCompanyAuth(id, c.req.header);

    const member = await db.member.findFirst({
      where: {
        id: memberId,
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

    return c.json({ member });
  });
};

export default getOne;
