import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerSafeRoutes } from "./routes/company/safes";
import { registerShareRoutes } from "./routes/company/share";
import { registerStakeholderRoutes } from "./routes/company/stakeholder";

const api = PublicAPI();

api.use("*", initMiddleware());

// Register RESTful routes
registerSafeRoutes(api);
registerShareRoutes(api);
registerCompanyRoutes(api);
registerStakeholderRoutes(api);

export default api;
