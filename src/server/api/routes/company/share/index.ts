import type { PublicAPI } from "@/server/api/hono";
import getMany from "./getMany";
import getOne from "./getOne";

const shareRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
};

export default shareRoutes;
