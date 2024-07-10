import type { PublicAPI } from "@/server/api/hono";
import create from "./create";
import getMany from "./getMany";
import getOne from "./getOne";

const shareRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
  create(api);
};

export default shareRoutes;
