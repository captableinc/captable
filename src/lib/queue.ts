import type { JOB_TYPES } from "@/constants/job";
import { logger } from "@/lib/logger";
import { singleton } from "@/lib/singleton";
import PgBoss from "pg-boss";
import type { z } from "zod";

const CONNECTION_URL =
  process.env.QUEUE_DATABASE_URL ?? (process.env.DATABASE_URL as string);

const queue = singleton(
  "pg-boss",
  () =>
    new PgBoss({
      connectionString: CONNECTION_URL,
      max: 5,
      retryBackoff: true,
      retryLimit: 4,
      expireInHours: 48,
      archiveCompletedAfterSeconds: 60 * 60 * 2, // 2 hours
      deleteAfterDays: 2,
      retentionDays: 2,
    }),
);

type JobTypes = typeof JOB_TYPES;

const log = logger.child({ module: "queue" });
const logPrefix = (msg: string) => `[Queue] ${msg}`;

export type JobType = {
  [Key in keyof JobTypes]: `${Key}.${JobTypes[Key][number]}`;
}[keyof JobTypes];

interface WorkerFactory {
  name: JobType;
  handler: (job: PgBoss.Job<unknown>[]) => Promise<unknown>;
}

function createQueue() {
  const jobs = new Map<string, WorkerFactory>();

  async function start() {
    log.info(logPrefix("Starting queue manager"));

    queue.on("error", (error) => {
      log.error(logPrefix("error"), {
        type: "queue",
        error,
      });
    });

    await queue.start();

    for (const [jobName, job] of jobs.entries()) {
      log.info(logPrefix(`Registering job:${jobName}`));

      await queue.work(jobName, job.handler);
    }
  }

  function register(jobFactory: WorkerFactory) {
    jobs.set(jobFactory.name, jobFactory);
  }

  return { start, register };
}

const queueManager = createQueue();

function defineWorker<
  U extends ReturnType<typeof defineWorkerConfig>,
  T extends U["schema"],
  V,
>(config: U, handler: (job: PgBoss.Job<z.infer<T>>) => Promise<V>) {
  return {
    name: config.name,
    handler,
  };
}

function defineJob<U extends ReturnType<typeof defineWorkerConfig>>(config: U) {
  type TSchema = U["schema"];
  return {
    emit: (data: z.infer<TSchema>, options?: PgBoss.JobOptions) => {
      const data_ = config.schema.parse(data);
      return queue.send(config.name, data_, options ?? {});
    },
    bulkEmit: (data: Omit<PgBoss.JobInsert<z.infer<TSchema>>, "name">[]) => {
      return queue.insert(
        data.map((items) => ({ ...items, name: config.name })),
      );
    },
  };
}

interface defineWorkerConfigOptions<T> {
  schema: T;
  name: JobType;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function defineWorkerConfig<T extends z.ZodObject<any>>(
  opts: defineWorkerConfigOptions<T>,
) {
  return opts;
}

export { queue, queueManager, defineWorkerConfig, defineJob, defineWorker };
