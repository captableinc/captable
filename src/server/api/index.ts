import { PublicAPI } from "./hono";
import companyRoutes from "./routes/company";
import safeRoutes from "./routes/company/safes";

export const api = PublicAPI();

// RESTful routes for company
companyRoutes(api);

// RESTful routes for SAFEs
safeRoutes(api);

export default api;
