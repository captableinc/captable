import { PublicAPI } from "./hono";
import companyRoutes from "./routes/company";

export const api = PublicAPI();

// RESTful routes for company
companyRoutes(api);

export default api;
