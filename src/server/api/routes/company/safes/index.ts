import type { PublicAPI } from "@/server/api/hono";
import create from "./create";
import deleteOne from "./deleteOne";
import getMany from "./getMany";
import getOne from "./getOne";
import update from "./update";

export const registerSafeRoutes = (api: PublicAPI) => {
  update(api);
  create(api);
  getOne(api);
  getMany(api);
  deleteOne(api);
};
