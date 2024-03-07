import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

import { Audit } from "@/server/audit";

export const shareClassRouter = createTRPCRouter({
  create: withAuth.input({}).mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp } = ctx;
  }),
});
