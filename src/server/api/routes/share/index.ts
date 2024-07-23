import type { PublicAPI } from "@/server/api/hono";
import { _delete } from "./delete";

export const registerShareRoutes = (api: PublicAPI) => {
  api.openapi(_delete.route, _delete.handler);
};
