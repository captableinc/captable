import type { TPrismaOrTransaction } from "@/server/db";
import { withAuth } from "@/trpc/api/trpc";
import {
  type TypeZodCreateBucketMutationSchema,
  ZodCreateBucketMutationSchema,
} from "../schema";

interface createBucketsHandlerOptions {
  input: TypeZodCreateBucketMutationSchema;
  db: TPrismaOrTransaction;
}

export const createBucketsHandler = async ({
  db,
  input: bucketData,
}: createBucketsHandlerOptions) => {
  // https://github.com/prisma/prisma/releases @version 5.14.0(stable)
  return await db.bucket.createManyAndReturn({
    data: bucketData,
    skipDuplicates: true,
    select: {
      id: true,
      name: true,
    },
  });
};

export const createBucketProcedure = withAuth
  .input(ZodCreateBucketMutationSchema)
  .mutation(async ({ ctx: { db }, input }) => {
    return await createBucketsHandler({ input, db });
  });
