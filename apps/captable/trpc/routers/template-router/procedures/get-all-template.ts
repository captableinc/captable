import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { db, desc, eq, templates } from "@captable/db";

export const getAllTemplateProcedure = withAuth.query(async ({ ctx }) => {
  const { documents } = await db.transaction(async (tx) => {
    const { companyId } = await checkMembership({ tx, session: ctx.session });

    const documents = await tx
      .select({
        id: templates.id,
        publicId: templates.publicId,
        status: templates.status,
        completedOn: templates.completedOn,
        name: templates.name,
        createdAt: templates.createdAt,
      })
      .from(templates)
      .where(eq(templates.companyId, companyId))
      .orderBy(desc(templates.createdAt));

    return { documents };
  });

  return { documents };
});
