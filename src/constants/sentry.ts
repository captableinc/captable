import { env } from "@/env";

export const isSentryEnabled = !!(
  env.SENTRY_ORG &&
  env.SENTRY_PROJECT &&
  env.NEXT_PUBLIC_SENTRY_DSN
);
