import { createTRPCRouter } from '@/trpc/api/trpc'
import { createBucketProcedure } from './procedures/create-bucket'

export const bucketRouter = createTRPCRouter({
  create: createBucketProcedure,
})
