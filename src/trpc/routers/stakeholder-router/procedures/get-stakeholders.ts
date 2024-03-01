import { withAuth } from "@/trpc/api/trpc";

export const getStakeholdersProcedure = withAuth.query(async ({ ctx }) => {
  const {
    db,
    session: { user },
  } = ctx;

  const data = await db.stakeholder.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
});
