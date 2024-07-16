import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { UpdateMutationSchema } from "../schema";

export const saveUpdateProcedure = withAuth
  .input(UpdateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const authorId = ctx.session.user.memberId;
      const companyId = ctx.session.user.companyId;
      const userId = ctx.session.user.id;
      const userName = ctx.session.user.name;
      const { userAgent, requestIp } = ctx;
      const publicId = input.publicId ?? generatePublicId();
      const { title, content, html } = input;

      if (title.length === 0 || content.length === 0) {
        return {
          success: false,
          message: "Title and content cannot be empty.",
        };
      }
      await ctx.db.$transaction(async (tx) => {
        if (input.publicId) {
          const update = await tx.update.update({
            where: { publicId },
            data: {
              html,
              title,
              content,
            },
          });

          await Audit.create(
            {
              action: "update.updated",
              companyId: companyId,
              actor: { type: "user", id: userId },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "update", id: update.id }],
              summary: `${userName} updated an Update ${update.title} for the company with id ${companyId}`,
            },
            tx,
          );
        } else {
          const update = await tx.update.create({
            data: {
              html,
              title,
              content,
              publicId,
              companyId,
              authorId,
            },
          });

          await Audit.create(
            {
              action: "update.created",
              companyId: companyId,
              actor: { type: "user", id: userId },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "update", id: update.id }],
              summary: `${userName} created an Update ${update.title} for the company with id ${companyId}`,
            },
            tx,
          );
        }
      });

      return {
        publicId,
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
  });
