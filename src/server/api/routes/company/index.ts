import type { PublicAPI } from "@/server/api/hono";
import getMany from "./getMany";
import getOne from "./getOne";
// import create from "./create";
// import update from "./update";

const companyRoutes = (api: PublicAPI) => {
  getOne(api);
  getMany(api);
  // create(api); // TODO - Implement create
  // update(api); // TODO - Implement update
};

export default companyRoutes;
