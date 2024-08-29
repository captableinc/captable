import type { OpenAPIHono } from "@hono/zod-openapi";
import { create } from "./create";
import { _delete } from "./delete";
import { getMany } from "./getMany";
import { getOne } from "./getOne";
import { update } from "./update";

export const registerStakeholderRoutes = (api: OpenAPIHono) =>
  api
    .openapi(getOne.route, getOne.handler)
    .openapi(update.route, update.handler)
    .openapi(_delete.route, _delete.handler)
    .openapi(create.route, create.handler)
    .openapi(getMany.route, getMany.handler);
