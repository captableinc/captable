import { AuthVerificationEmailJob } from "@/jobs/auth-verification-email";
import { JobManager, boss } from "./pg-boss-base";

export async function initPgBoss() {
  const jobs = new JobManager(boss).register(AuthVerificationEmailJob);

  await jobs.start();
}
