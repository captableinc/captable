import type { OpenAPIHono } from "@hono/zod-openapi";
import { create } from "./create";
import { deleteOne } from "./delete";
import { getMany } from "./getMany";

export const registerConvertibleNotesRoutes = (api: OpenAPIHono) =>
  api
    .openapi(create.route, create.handler)
    .openapi(deleteOne.route, deleteOne.handler)
    .openapi(getMany.route, getMany.handler);
