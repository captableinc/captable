import { protectedProcedure } from "@/trpc/api/trpc";

export const getMembersProcedure = protectedProcedure.query(async ({ ctx }) => {
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
      createdAt: "asc",
    },
  });

  return { data };
});
