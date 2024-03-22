// import { Audit } from "@/server/audit";
import { generatePublicId } from "@/common/id";
import { UpdateMutationSchema } from "./schema";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

export const updateRouter = createTRPCRouter({
  save: withAuth
    .input(UpdateMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const author = ctx.session.user;
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
              console.log("=============> Updating an existing update");
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
                  authorId: author.id,
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
    }),
});
