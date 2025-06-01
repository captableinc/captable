import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { and, db, eq, templates } from "@captable/db";
import { ZodCancelTemplateMutationSchema } from "../schema";

export const cancelTemplateProcedure = withAuth
  .input(ZodCancelTemplateMutationSchema)
  .mutation(async ({ input, ctx }) => {
    const { templateId, publicId } = input;
    const res = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session: ctx.session });

      const templateResult = await tx
        .select({
          id: templates.id,
        })
        .from(templates)
        .where(
          and(
            eq(templates.id, templateId),
            eq(templates.companyId, companyId),
            eq(templates.publicId, publicId),
          ),
        )
        .limit(1);

      const template = templateResult[0];
      if (!template) {
        return { message: "Invalid Template ID", success: false };
      }

      await tx
        .update(templates)
        .set({
          status: "CANCELLED",
          updatedAt: new Date(),
        })
        .where(eq(templates.id, template.id));

      return {
        message: "Successfully set the document status to CANCELLED",
        success: true,
      };
    });

    return res;
  });
