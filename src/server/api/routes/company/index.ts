import type { OpenAPIHono } from "@hono/zod-openapi";
import { getMany } from "./getMany";
import { getOne } from "./getOne";

export const registerCompanyRoutes = (api: OpenAPIHono) => {
  return api
    .openapi(getMany.route, getMany.handler)
    .openapi(getOne.route, getOne.handler);
};
