import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodCancelTemplateMutationSchema } from "../schema";

export const cancelTemplateProcedure = withAuth
  .input(ZodCancelTemplateMutationSchema)
  .mutation(async ({ input, ctx }) => {
    const { templateId, publicId } = input;
    const res = await ctx.db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session: ctx.session });

      const template = await tx.template.findFirst({
        where: {
          id: templateId,
          companyId,
          publicId,
        },
      });

      if (!template) {
        return { message: "Invalid Template ID", success: false };
      }

      await tx.template.update({
        where: {
          id: template.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      return {
        message: "Successfully set the document status to CANCELLED",
        success: true,
      };
    });

    return res;
  });
