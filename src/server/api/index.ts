import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerShareRoutes } from "./routes/company/share";
import { registerStakeholderRoutes } from "./routes/company/stakeholder";
import { registerSessionRoutes } from "./routes/session";

const api = PublicAPI();

api.use("*", initMiddleware());

// Register RESTful routes
registerCompanyRoutes(api);
registerSessionRoutes(api);
registerShareRoutes(api);
registerStakeholderRoutes(api);

export default api;
