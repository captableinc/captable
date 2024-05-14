import { env } from "@/env";
import PgBoss, { Job } from "pg-boss";
import { singleton } from "./singleton";

const boss = singleton(
  "pg-boss",
  () =>
    new PgBoss({
      connectionString: env.DATABASE_URL,
    }),
);

export async function initPgBoss() {
  await boss.start();

  const queue = "some-queue";

  await boss.work(queue, someAsyncJobHandler);

  const jobId = await boss.send(queue, { param1: "foo" });

  console.log(`created job in queue ${queue}: ${jobId}`);
}

async function someAsyncJobHandler(job: Job) {
  console.log(`job ${job.id} received with data:`);
  console.log(JSON.stringify(job.data));
}
