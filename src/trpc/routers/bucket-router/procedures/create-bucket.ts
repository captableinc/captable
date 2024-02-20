import { withAuth } from "@/trpc/api/trpc";
import { ZodCreateBucketMutationSchema } from "../schema";

export const createBucketProcedure = withAuth
  .input(ZodCreateBucketMutationSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.bucket.create({ data: input });
  });
