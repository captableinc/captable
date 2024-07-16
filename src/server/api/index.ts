import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import shareRoutes from "./routes/company/share";

const api = PublicAPI();

api.use("*", initMiddleware());

// RESTful routes for company
registerCompanyRoutes(api);

// RESTful routes for shares
shareRoutes(api);

export default api;
