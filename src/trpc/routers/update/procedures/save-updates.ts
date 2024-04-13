import { generatePublicId } from "@/common/id";
import { UpdateMutationSchema } from "../schema";
import { withAuth } from "@/trpc/api/trpc";

export const saveUpdatesProcedure = withAuth
  .input(UpdateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const authorId = ctx.session.user.memberId;
      const companyId = ctx.session.user.companyId;
      const publicId = input.publicId ?? generatePublicId();
      const { title, content, html } = input;

      if (title.length === 0 || content.length === 0) {
        return {
          success: false,
          message: "Title and content cannot be empty.",
        };
      } else {
        await ctx.db.$transaction(async (tx) => {
          if (input.publicId) {
            await tx.update.update({
              where: { publicId },
              data: {
                html,
                title,
                content,
              },
            });
          } else {
            await tx.update.create({
              data: {
                html,
                title,
                content,
                publicId,
                companyId,
                authorId,
              },
            });
          }
        });

        return {
          publicId,
          success: true,
          message: "Successfully saved an update.",
        };
      }
    } catch (error) {
      console.error("Error saving an update:", error);
      return {
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  });
