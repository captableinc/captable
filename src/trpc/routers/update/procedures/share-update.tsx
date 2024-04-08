import { generatePublicId } from "@/common/id";
import { UpdateStatusEnum } from "@/prisma-enums";
import { withAuth } from "@/trpc/api/trpc";
import { ZodShareUpdateMutationSchema } from "../schema";

export const shareUpdateProcedure = withAuth
  .input(ZodShareUpdateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const authorId = ctx.session.user.memberId;
      const companyId = ctx.session.user.companyId;
      const publicId = input.publicId ?? generatePublicId();
      const isPublic = input.mode === "PUBLIC";

      const { title, content, html, stakeholderIds, updateId } = input;

      if (title.length === 0 && content.length === 0) {
        return {
          success: false,
          message: "Title or content cannot be empty.",
        };
      }

      await ctx.db.$transaction(async (tx) => {
        if (!input.publicId) {
          const update = await tx.update.create({
            data: {
              html,
              title,
              content,
              publicId,
              companyId,
              authorId,
              status: isPublic
                ? UpdateStatusEnum.PUBLIC
                : UpdateStatusEnum.PRIVATE,
            },
          });

          const recipients = stakeholderIds.map((shId) => ({
            stakeholderId: shId,
            updateId: update.id,
          }));

          await tx.updateRecipient.createMany({
            data: recipients,
            skipDuplicates: true,
          });
        } else {
          // update table
          // Find if content is updated --> save()
          // If not updated --> skip()
          // update recipients
          // delete the removed ones
          // add new ones
        }
      });

      return {
        success: true,
        message: "🎉 Successfully shared the update",
        link: `http://localhost:3000/updates/${publicId}`,
      };
    } catch (error) {
      console.error("Error adding options:", error);
      return {
        success: false,
        message: "Please use unique Grant Id.",
      };
    }
  });

// if(isPublic){
//   await tx.update.update({
//     where:{
//       id:updateId
//     },
//     data:{
//       status: UpdateStatusEnum.PUBLIC
//     }
//     })
// }

// share has been updated here in Nepal
// and all the matter of time so called line of time

// Opencap.co and overall the matter of time in the major open-source contributions
// welcome to the team manner
