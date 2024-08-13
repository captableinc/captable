import { PublicAPI } from "./hono";
import { middlewareServices } from "./middlewares/services";
import { registerCompanyRoutes } from "./routes/company";
import { registerConvertibleNotesRoutes } from "./routes/convertible-note";
import { registerShareRoutes } from "./routes/share";
import { registerStakeholderRoutes } from "./routes/stakeholder";

const api = PublicAPI();

api.use("*", middlewareServices());

// Register RESTful routes

const routes = api
  .route("", registerCompanyRoutes(api))
  .route("", registerConvertibleNotesRoutes(api))
  .route("", registerShareRoutes(api))
  .route("", registerStakeholderRoutes(api));

export type APIType = typeof routes;

export default api;
