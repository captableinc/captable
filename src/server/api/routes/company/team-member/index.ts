import type { PublicAPI } from "@/server/api/hono";
import getOne from "./getOne";

export const registerTeamMemberRoutes = (api: PublicAPI) => {
  getOne(api);
};
