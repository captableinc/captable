import { isSentryEnabled } from "./constants/sentry";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startJobs } = await import("@/jobs/start");
    await startJobs();

    if (isSentryEnabled) {
      await import("../sentry.server.config");
    }
  }

  if (process.env.NEXT_RUNTIME === "edge" && isSentryEnabled) {
    await import("../sentry.edge.config");
  }
}
