import { Audit } from "@/server/audit";
import { TPrismaOrTransaction } from "@/server/db";
import { withAuth } from "@/trpc/api/trpc";
import {
  type TypeZodCreateBucketMutationSchema,
  ZodCreateBucketMutationSchema,
} from "../schema";

interface createBucketHandlerOptions {
  input: TypeZodCreateBucketMutationSchema;
  db: TPrismaOrTransaction;
}

export const createBucketHandler = ({
  db,
  input,
}: createBucketHandlerOptions) => {
  return db.bucket.create({ data: input });
};

export const createBucketProcedure = withAuth
  .input(ZodCreateBucketMutationSchema)
  .mutation(
    async ({
      ctx: {
        db,
        session: { user },
        requestIp,
        userAgent,
      },
      input,
    }) => {
      try {
        await db.$transaction(async (tx) => {
          const bucket = await db.bucket.create({ data: input });
          await Audit.create(
            {
              action: "bucket.created",
              companyId: user.companyId,
              actor: { type: "user", id: user.id },
              context: {
                requestIp,
                userAgent,
              },
              target: [{ type: "bucket", id: bucket.id }],
              summary: `${user.name} created a new s3 bucket.`,
            },
            tx,
          );
        });
      } catch (error) {
        console.log({ error });
      }
    },
  );
