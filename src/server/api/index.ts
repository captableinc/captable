import { PublicAPI } from "./hono";
import { initMiddleware } from "./middlewares/init";
import { registerCompanyRoutes } from "./routes/company";
import { registerShareRoutes } from "./routes/company/share";
import { registerStakeholderRoutes } from "./routes/company/stakeholder";
import { registerTeamMemberRoutes } from "./routes/company/team-member";

const api = PublicAPI();

api.use("*", initMiddleware());

// Register RESTful routes
registerCompanyRoutes(api);
registerShareRoutes(api);
registerStakeholderRoutes(api);
registerTeamMemberRoutes(api);

export default api;
