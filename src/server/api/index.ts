import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import companyRoutes from "./routes/company";
import stakeholderRoutes from "./routes/company/stakeholder";

const api = PublicAPI();

api.use("*", initMiddleware());

// RESTful routes for company
registerCompanyRoutes(api);

// RESTful routes for a stakeholder in a company
stakeholderRoutes(api);

export default api;
