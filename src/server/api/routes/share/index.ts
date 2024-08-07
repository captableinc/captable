import type { PublicAPI } from "@/server/api/hono";
import { create } from "./create";
import { _delete } from "./delete";
import { getMany } from "./getMany";
import { getOne } from "./getOne";
import { update } from "./update";

export const registerShareRoutes = (api: PublicAPI) => {
  api.openapi(_delete.route, _delete.handler);
  api.openapi(getOne.route, getOne.handler);
  api.openapi(getMany.route, getMany.handler);
  api.openapi(create.route, create.handler);
  api.openapi(update.route, update.handler);
};
