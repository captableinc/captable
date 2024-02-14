import { protectedProcedure } from "@/trpc/api/trpc";

export const getAllDocumentsProcedure = protectedProcedure.query(
  async ({ ctx }) => {
    const user = ctx.session.user;

    const data = await ctx.db.document.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        uploader: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return data;
  },
);
