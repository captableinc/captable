import { withAuth } from "@/trpc/api/trpc";

export const getMembersProcedure = withAuth.query(async ({ ctx }) => {
  const {
    db,
    session: { user },
  } = ctx;

  const data = await db.membership.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },

    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return { data };
});
