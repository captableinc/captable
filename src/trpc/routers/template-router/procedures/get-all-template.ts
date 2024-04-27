import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";

export const getAllTemplateProcedure = withAuth.query(async ({ ctx }) => {
  const { documents } = await ctx.db.$transaction(async (tx) => {
    const { companyId } = await checkMembership({ tx, session: ctx.session });

    const documents = await tx.template.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        publicId: true,
        status: true,
        completedOn: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { documents };
  });

  return { documents };
});
