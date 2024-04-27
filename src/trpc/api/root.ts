import { createTRPCRouter } from "@/trpc/api/trpc";
import { auditRouter } from "../routers/audit-router/router";
import { bucketRouter } from "../routers/bucket-router/router";
import { companyRouter } from "../routers/company-router/router";
import { dataRoomRouter } from "../routers/data-room-router/router";
import { documentRouter } from "../routers/document-router/router";
import { documentShareRouter } from "../routers/document-share-router/router";
import { equityPlanRouter } from "../routers/equity-plan/router";
import { memberRouter } from "../routers/member-router/router";
import { onboardingRouter } from "../routers/onboarding-router/router";
import { safeRouter } from "../routers/safe/router";
import { securitiesRouter } from "../routers/securities-router/router";
import { shareClassRouter } from "../routers/share-class/router";
import { stakeholderRouter } from "../routers/stakeholder-router/router";
import { templateFieldRouter } from "../routers/template-field-router/router";
import { templateRouter } from "../routers/template-router/router";
import { updateRouter } from "../routers/update/router";
import { authRouter } from "../routers/auth/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  audit: auditRouter,
  company: companyRouter,
  document: documentRouter,
  documentShare: documentShareRouter,
  onboarding: onboardingRouter,
  shareClass: shareClassRouter,
  equityPlan: equityPlanRouter,
  member: memberRouter,
  bucket: bucketRouter,
  template: templateRouter,
  templateField: templateFieldRouter,
  stakeholder: stakeholderRouter,
  securities: securitiesRouter,
  safe: safeRouter,
  update: updateRouter,
  auth: authRouter,
  dataRoom: dataRoomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
