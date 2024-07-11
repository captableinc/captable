import { PublicAPI } from "./hono";
import companyRoutes from "./routes/company";
import shareRoutes from "./routes/company/share";

export const api = PublicAPI();

// RESTful routes for company
companyRoutes(api);

// RESTful routes for shares
shareRoutes(api);

export default api;
