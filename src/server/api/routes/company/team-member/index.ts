import type { PublicAPI } from "@/server/api/hono";
import create from "./create";
import deleteOne from "./delete";
import getMany from "./getMany";
import getOne from "./getOne";
import update from "./update";

export const registerTeamMemberRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
  create(api);
  update(api);
  deleteOne(api);
};
