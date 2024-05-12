import { type TPrismaOrTransaction } from '@/server/db'
import { withAuth } from '@/trpc/api/trpc'
import {
  type TypeZodCreateBucketMutationSchema,
  ZodCreateBucketMutationSchema,
} from '../schema'

interface createBucketHandlerOptions {
  input: TypeZodCreateBucketMutationSchema
  db: TPrismaOrTransaction
}

export const createBucketHandler = ({
  db,
  input,
}: createBucketHandlerOptions) => {
  return db.bucket.create({ data: input })
}

export const createBucketProcedure = withAuth
  .input(ZodCreateBucketMutationSchema)
  .mutation(async ({ ctx: { db }, input }) => {
    return createBucketHandler({ input, db })
  })
