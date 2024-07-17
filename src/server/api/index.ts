import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerSafeRoutes } from "./routes/safe";

const api = PublicAPI();

api.use("*", initMiddleware());

registerCompanyRoutes(api);
registerSafeRoutes(api);

export default api;
