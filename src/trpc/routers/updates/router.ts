// import { Audit } from "@/server/audit";
import { generatePublicId } from "@/common/id";
import { UpdatesMutationSchema } from "./schema";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

export const safeRouter = createTRPCRouter({
  save: withAuth
    .input(UpdatesMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const author = ctx.session.user;
        const companyId = ctx.session.user.companyId;
        const publicId = input.publicId ?? generatePublicId();

        await ctx.db.$transaction(async (tx) => {
          const { title, content, html } = input;

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
        });

        return {
          success: true,
          message: "Successfully saved an update.",
        };
      } catch (error) {
        console.error("Error saving an update:", error);
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),
});
