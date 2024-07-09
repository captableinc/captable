import type { PublicAPI } from "@/server/api/hono";
import getOne from "./getOne";

const shareRoutes = (api: PublicAPI) => {
  getOne(api);
};

export default shareRoutes;
