import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const waitlistUser = createTRPCRouter({
  update: protectedProcedure 
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { user } = ctx.session;
      const { email } = input;

      const currentWaitlistUser = await db.waitlistUser.findUnique({
        where: {
          id: user.id,
        },
        select: {
          email: true,
        },
      });

      const updatedWaitlistUser = db.waitlistUser.update({
        where: {
          id: user.id,
        },
        data: {
          email,
        },
        select: {
          email: true,
        },
      });

      return updatedWaitlistUser;
    }),
});