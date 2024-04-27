import { withAuth } from "@/trpc/api/trpc";

export const getAllTemplateProcedure = withAuth.query(async ({ ctx }) => {
  const user = ctx.session.user;

  const { documents } = await ctx.db.$transaction(async (tx) => {
    const { companyId } = await tx.member.findFirstOrThrow({
      where: {
        id: user.memberId,
        companyId: user.companyId,
      },
      select: {
        companyId: true,
      },
    });

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
