import type { PublicAPI } from "@/server/api/hono";

import { create } from "./create";

export const registerConvertibleNotesRoutes = (api: PublicAPI) => {
  api.openapi(create.route, create.handler);
};
