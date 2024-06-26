import { PublicAPI } from "./hono";
import companyRoutes from "./routes/company";
import teamRoutes from "./routes/company/team";

export const api = PublicAPI();

// RESTful routes for company
companyRoutes(api);

// RESTful routes for a team in a company
teamRoutes(api);

export default api;
