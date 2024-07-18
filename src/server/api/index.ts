import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerSafeRoutes } from "./routes/company/safes";

const api = PublicAPI();

api.use("*", initMiddleware());

registerCompanyRoutes(api);
registerSafeRoutes(api);

export default api;
