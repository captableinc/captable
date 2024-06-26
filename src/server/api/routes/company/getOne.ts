import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context, HonoRequest } from "hono";

const route = createRoute({
  method: "get",
  path: "/v1/companies/:cid",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Get a company by ID",
    },

    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const req: HonoRequest = await c.req;
    console.log({ req });
    return c.json({ message: "TODO: implement this endpoint" });
  });
};

export default getOne;
