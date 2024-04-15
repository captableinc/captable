import { withAuth } from "@/trpc/api/trpc";

export const getSharesProcedure = withAuth.query(async ({ ctx, input }) => {
  const user = ctx.session.user;

  const data = await ctx.db.share.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      stakeholder: true,
      shareClass: true,
      documents: true,
    },
  });

  return { data };
});
