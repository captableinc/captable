import { withAuth } from "@/trpc/api/trpc";

export const getShareClassProcedure = withAuth.query(async ({ ctx }) => {
  const {
    db,
    session: { user },
  } = ctx;

  const data = await db.shareClass.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
});
