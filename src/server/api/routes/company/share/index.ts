import type { PublicAPI } from "@/server/api/hono";
import create from "./create";
import delete_ from "./delete";
import getMany from "./getMany";
import getOne from "./getOne";
import update from "./update";

const shareRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
  create(api);
  update(api);
  delete_(api);
};

export default shareRoutes;
