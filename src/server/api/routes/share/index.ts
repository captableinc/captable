import type { PublicAPI } from "@/server/api/hono";
import { _delete } from "./delete";
import { getMany } from "./getMany";
import { getOne } from "./getOne";

export const registerShareRoutes = (api: PublicAPI) => {
  api.openapi(_delete.route, _delete.handler);
  api.openapi(getOne.route, getOne.handler);
  api.openapi(getMany.route, getMany.handler);
};
