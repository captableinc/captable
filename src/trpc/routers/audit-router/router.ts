import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { ZodGetAuditsQuerySchema } from "./schema";

export const auditRouter = createTRPCRouter({
  getAudits: withAuth
    .input(ZodGetAuditsQuerySchema)
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const user = session.user;
      const data = await db.audit.findMany({
        where: { companyId: user.companyId },
        orderBy: {
          occurredAt: "desc",
        },
        ...input,
      });
      return { data };
    }),
});
