import type { PublicAPI } from "@/server/api/hono";
import create from "./create";
import getMany from "./getMany";
import getOne from "./getOne";
import update from "./update";

const shareRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
  create(api);
  update(api);
};

export default shareRoutes;
