import type { PublicAPI } from "@/server/api/hono";
import { sessionRoute } from "./session";

export const registerSessionRoutes = (api: PublicAPI) => {
  api.openapi(sessionRoute.route, sessionRoute.handler);
};
