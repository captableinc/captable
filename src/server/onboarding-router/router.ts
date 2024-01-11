import { createTRPCRouter, protectedProcedure } from "../api/trpc";
import { ZOnboardMutationSchema } from "./schema";

export const onboardingRouter = createTRPCRouter({
  onboard: protectedProcedure
    .input(ZOnboardMutationSchema)
    .mutation(({ ctx, input }) => {
      return;
    }),
});
