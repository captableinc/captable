import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerShareRoutes } from "./routes/company/share";
import { registerStakeholderRoutes } from "./routes/stakeholder";

const api = PublicAPI();

api.use("*", initMiddleware());

// Register RESTful routes
registerCompanyRoutes(api);
registerShareRoutes(api);
registerStakeholderRoutes(api);

export default api;
