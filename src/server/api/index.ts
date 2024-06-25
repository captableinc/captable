import { PublicAPI } from "./hono";
import companyRoute from "./routes/company";

export const api = PublicAPI();

// Restful routes for company
companyRoute(api);

export default api;
