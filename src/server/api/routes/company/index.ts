import type { PublicAPI } from "@/server/api/hono";
import { getMany } from "./getMany";
import { getOne } from "./getOne";

export const registerCompanyRoutes = (api: PublicAPI) => {
  api.openapi(getMany.route, getMany.handler);
  api.openapi(getOne.route, getOne.handler);
};
