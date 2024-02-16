import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodCreateBucketMutationSchema } from "../schema";

export const createBucketProcedure = protectedProcedure
  .input(ZodCreateBucketMutationSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.bucket.create({ data: input });
  });
