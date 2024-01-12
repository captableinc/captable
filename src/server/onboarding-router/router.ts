import { createTRPCRouter, protectedProcedure } from "../api/trpc";
import { ZodOnboardingMutationSchema } from "./schema";

export const onboardingRouter = createTRPCRouter({
  onboard: protectedProcedure
    .input(ZodOnboardingMutationSchema)
    .mutation(({ ctx, input }) => {
      return;
    }),
});
