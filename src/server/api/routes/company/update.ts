import type { PublicAPI } from "@/server/api/hono";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context, HonoRequest } from "hono";

const route = createRoute({
  method: "put",
  path: "/v1/companies/:id",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Update a company by ID",
    },
  },
});

const update = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const req: HonoRequest = await c.req;
    console.log({ req });
    return c.json({ message: "Hello, World!" });
  });
};

export default update;
