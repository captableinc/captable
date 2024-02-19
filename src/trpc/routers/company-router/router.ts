import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { ZodSwitchCompanyMutationSchema } from "./schema";

export const companyRouter = createTRPCRouter({
  switchCompany: withAuth
    .input(ZodSwitchCompanyMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.member.update({
        where: {
          id: input.id,
        },
        data: {
          lastAccessed: new Date(),
        },
      });
      return { success: true };
    }),
});
