import { PublicAPI } from "./hono";
import { middlewareServices } from "./middlewares/services";
import { registerCompanyRoutes } from "./routes/company";
import { registerSafeRoutes } from "./routes/safe";
import { registerShareRoutes } from "./routes/share";
import { registerStakeholderRoutes } from "./routes/stakeholder";

const api = PublicAPI();

api.use("*", middlewareServices());

// Register RESTful routes
registerSafeRoutes(api);
registerShareRoutes(api);
registerCompanyRoutes(api);
registerStakeholderRoutes(api);

export default api;
