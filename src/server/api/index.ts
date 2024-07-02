import { PublicAPI } from "./hono";
import companyRoutes from "./routes/company";
import securitiesRoutes from "./routes/company/securities";
// import transactionsRoutes from "./routes/company/transaction";

export const api = PublicAPI();

// RESTful routes for company
companyRoutes(api);

// RESTful routes for securities
securitiesRoutes(api);

// RESTful routes for transactions
// transactionsRoutes(api);

export default api;
