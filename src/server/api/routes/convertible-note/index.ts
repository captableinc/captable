import type { OpenAPIHono } from "@hono/zod-openapi";
import { create } from "./create";

export const registerConvertibleNotesRoutes = (api: OpenAPIHono) =>
  api.openapi(create.route, create.handler);
