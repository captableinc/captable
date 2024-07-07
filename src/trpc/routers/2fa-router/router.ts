import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { z } from "zod";

export const twoFactorAuthRouter = createTRPCRouter({
  setup: withAuth.mutation(({ ctx: { session } }) => {
    try {
      console.log({ session });
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Something went out while setting up.Please try again later",
      };
    }
  }),

  enable: withAuth
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => {
      try {
        console.log({ ctx, input });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: "Something went out while enabling.Please try again later",
        };
      }
    }),

  disable: withAuth
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => {
      try {
        console.log({ ctx, input });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: "Something went out while enabling.Please try again later",
        };
      }
    }),
});
