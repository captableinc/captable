import { z } from "@hono/zod-openapi";
import { withAuthApiV1 } from "../../utils/endpoint-creator";

export const sessionRoute = withAuthApiV1
  .createRoute({
    method: "get",
    path: "/v1/session",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
          },
        },
        description: "Get a company by ID",
      },
    },
  })
  .handler((c) => {
    return c.json({ message: "hello" });
  });
