import type { PublicAPI } from "@/server/api/hono";
import create from "./create";
import getMany from "./getMany";
import getOne from "./getOne";

export const registerTeamMemberRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
  create(api);
};
