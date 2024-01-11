import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { waitlistUser } from "./routes/waitlistuser";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  waitlistUser
});

// export type definition of API
export type AppRouter = typeof appRouter;
