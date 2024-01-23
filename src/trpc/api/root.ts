import { createTRPCRouter } from "@/trpc/api/trpc";
import { onboardingRouter } from "../routers/onboarding-router/router";
import { waitListRouter } from "../routers/waitlist-router/router";
import { stakeholderRouter } from "../routers/stakeholder-router/router";
import { companyRouter } from "../routers/company-router/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  onboarding: onboardingRouter,
  waitList: waitListRouter,
  stakeholder: stakeholderRouter,
  company: companyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
