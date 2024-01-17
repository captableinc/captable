import { createTRPCRouter, publicProcedure } from "@/trpc/api/trpc";
import { ZodAddToWaitListMutationSchema } from "./schema";

export const waitListRouter = createTRPCRouter({
  addToWaitList: publicProcedure
    .input(ZodAddToWaitListMutationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.waitlistUser.upsert({
        where: {
          email: input.email,
        },
        update: {},
        create: {
          email: input.email,
        },
      });
      return { success: true, message: "successfully added to waitlist" };
    }),
});
