import { createTRPCRouter, adminOnlyProcedure } from "@/trpc/api/trpc";
import { DocumentMutationSchema } from "./schema";

export const documentRouter = createTRPCRouter({
  create: adminOnlyProcedure
    .input(DocumentMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const uploadedById = session.user.id;
      const companyId = session.user.companyId;

      await db.document.create({
        data: {
          ...input,
          uploadedById,
          companyId,
        },
      });

      return { success: true };
    }),
});
