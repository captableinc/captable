import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodCreateBucketMutationSchema,
  ZodCreateBucketMutationSchema,
} from "../schema";

interface createBucketHandlerOptions {
  ctx: withAuthTrpcContextType;
  input: TypeZodCreateBucketMutationSchema;
}

export const createBucketHandler = ({
  ctx,
  input,
}: createBucketHandlerOptions) => {
  return ctx.db.bucket.create({ data: input });
};

export const createBucketProcedure = withAuth
  .input(ZodCreateBucketMutationSchema)
  .mutation(async (opts) => {
    return createBucketHandler(opts);
  });
