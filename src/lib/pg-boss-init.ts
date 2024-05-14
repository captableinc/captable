import { JobManager, boss } from "./pg-boss-base";

export async function initPgBoss() {
  const jobs = new JobManager(boss);

  await jobs.start();
}
