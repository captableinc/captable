import { createTRPCRouter } from "@/trpc/api/trpc";
import { auditRouter } from "../routers/audit-router/router";
import { companyRouter } from "../routers/company-router/router";
import { shareClassRouter } from "../routers/share-class/router";
import { equityPlanRouter } from "../routers/equity-plan/router";
import { waitListRouter } from "../routers/waitlist-router/router";
import { onboardingRouter } from "../routers/onboarding-router/router";
import { stakeholderRouter } from "../routers/stakeholder-router/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  audit: auditRouter,
  company: companyRouter,
  waitList: waitListRouter,
  onboarding: onboardingRouter,
  shareClass: shareClassRouter,
  equityPlan: equityPlanRouter,
  stakeholder: stakeholderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
