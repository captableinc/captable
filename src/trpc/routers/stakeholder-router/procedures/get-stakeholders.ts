import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";

export const getStakeholdersProcedure = withAuth.query(async ({ ctx }) => {
  const { db, session } = ctx;

  const data = await db.$transaction(async (tx) => {
    const { companyId } = await checkMembership({ session, tx });

    const stakeholder = await tx.stakeholder.findMany({
      where: {
        companyId,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stakeholder;
  });

  return data;
});
