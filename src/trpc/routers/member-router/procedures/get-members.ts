import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";

export const getMembersProcedure = withAuth.query(async ({ ctx }) => {
  const { db, session } = ctx;

  const data = await db.$transaction(async (tx) => {
    const { companyId } = await checkMembership({ tx, session });

    const data = await tx.member.findMany({
      where: {
        companyId,
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

    return data;
  });

  return { data };
});
