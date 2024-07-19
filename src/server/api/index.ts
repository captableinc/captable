import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerSessionRoutes } from "./routes/session";

const api = PublicAPI();

api.use("*", initMiddleware());

// RESTful routes for company
registerCompanyRoutes(api);
registerSessionRoutes(api);

export default api;
