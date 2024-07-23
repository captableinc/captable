import type { PublicAPI } from "@/server/api/hono";
import { create } from "./create";
import { _delete } from "./delete";
import { getOne } from "./getOne";
import { update } from "./update";

export const registerStakeholderRoutes = (api: PublicAPI) => {
  api.openapi(getOne.route, getOne.handler);
  api.openapi(update.route, update.handler);
  api.openapi(_delete.route, _delete.handler);
  api.openapi(create.route, create.handler);
};
