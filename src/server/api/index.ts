import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";

const api = PublicAPI();

api.use("*", initMiddleware());

// RESTful routes for company
registerCompanyRoutes(api);

export default api;
