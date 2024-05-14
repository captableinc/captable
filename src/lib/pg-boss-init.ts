import { AuthVerificationEmailJob } from "@/jobs/auth-verification-email";
import { ShareUpdateEmailJob } from "@/jobs/share-update-email";
import { JobManager, boss } from "./pg-boss-base";

export async function initPgBoss() {
  const jobs = new JobManager(boss)
    .register(AuthVerificationEmailJob)
    .register(ShareUpdateEmailJob);

  await jobs.start();
}
