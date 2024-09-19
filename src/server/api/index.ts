import { PublicAPI } from "./hono";
import { middlewareServices } from "./middlewares/services";
import { registerCompanyRoutes } from "./routes/company";
import { registerShareRoutes } from "./routes/share";
import { registerStakeholderRoutes } from "./routes/stakeholder";
import { registerOptionRoutes } from "./routes/stock-option";

const api = PublicAPI();

api.use("*", middlewareServices());

// Register RESTful routes
registerCompanyRoutes(api);
registerShareRoutes(api);
registerStakeholderRoutes(api);
registerOptionRoutes(api);

export default api;
