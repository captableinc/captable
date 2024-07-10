import { checkMembership } from "@/server/auth";
import { withAccessControl } from "@/trpc/api/trpc";

export const getMembersProcedure = withAccessControl
  .meta({ policies: { members: { allow: ["read"] } } })
  .query(async ({ ctx }) => {
    const {
      db,
      membership: { companyId },
    } = ctx;

    const data = await db.member.findMany({
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

    return { data };
  });
