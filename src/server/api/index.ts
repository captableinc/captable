import { PublicAPI } from "./hono";
import { middlewareServices } from "./middlewares/services";
import { registerCompanyRoutes } from "./routes/company";
import { registerConvertibleNotesRoutes } from "./routes/convertible-note";
import { registerShareRoutes } from "./routes/share";
import { registerStakeholderRoutes } from "./routes/stakeholder";

const api = PublicAPI();

api.use("*", middlewareServices());

// Register RESTful routes
registerCompanyRoutes(api);
registerShareRoutes(api);
registerStakeholderRoutes(api);
registerConvertibleNotesRoutes(api);

export default api;
