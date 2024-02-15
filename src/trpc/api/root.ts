import { createTRPCRouter } from "@/trpc/api/trpc";
import { auditRouter } from "../routers/audit-router/router";
import { companyRouter } from "../routers/company-router/router";
import { shareClassRouter } from "../routers/share-class/router";
import { equityPlanRouter } from "../routers/equity-plan/router";
import { documentRouter } from "../routers/document-router/router";
import { waitListRouter } from "../routers/waitlist-router/router";
import { onboardingRouter } from "../routers/onboarding-router/router";
import { stakeholderRouter } from "../routers/stakeholder-router/router";
import { bucketRouter } from "../routers/bucket-router/router";
import { templateRouter } from "../routers/template-router/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  audit: auditRouter,
  company: companyRouter,
  waitList: waitListRouter,
  document: documentRouter,
  onboarding: onboardingRouter,
  shareClass: shareClassRouter,
  equityPlan: equityPlanRouter,
  stakeholder: stakeholderRouter,
  bucket: bucketRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
