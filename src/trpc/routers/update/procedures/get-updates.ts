import { withAuth } from "@/trpc/api/trpc";

export const getUpdatesProcedure = withAuth.query(async ({ ctx }) => {
  const {
    db,
    session: { user },
  } = ctx;

  const data = await db.update.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
});
