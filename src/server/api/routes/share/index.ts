import type { OpenAPIHono } from "@hono/zod-openapi";
import { create } from "./create";
import { _delete } from "./delete";
import { getMany } from "./getMany";
import { getOne } from "./getOne";
import { update } from "./update";

export const registerShareRoutes = (api: OpenAPIHono) =>
  api
    .openapi(_delete.route, _delete.handler)
    .openapi(getOne.route, getOne.handler)
    .openapi(getMany.route, getMany.handler)
    .openapi(create.route, create.handler)
    .openapi(update.route, update.handler);
