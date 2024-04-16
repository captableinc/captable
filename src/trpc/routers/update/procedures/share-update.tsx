import { generatePublicId } from "@/common/id";
import { investorUpdateEmailJob } from "@/jobs/investor-update-email";
import { UpdateType } from "@/lib/constants";
import { UpdateStatusEnum } from "@/prisma-enums";
import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { ZodShareUpdateMutationSchema } from "../schema";

export const shareUpdateProcedure = withAuth
  .input(ZodShareUpdateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { requestIp, userAgent } = ctx;
      const authorId = ctx.session.user.memberId;
      const companyId = ctx.session.user.companyId;

      if (input.type === UpdateType.SAVE_AND_SEND) {
        const publicId = generatePublicId();
        const { html, title, content, stakeholders } = input.payload;
        if (title.length === 0 && content.length === 0) {
          return {
            success: false,
            message: "Title or content cannot be empty.",
            publicId: "",
          };
        }
        await ctx.db.$transaction(async (tx) => {
          const update = await tx.update.create({
            data: {
              html,
              title,
              content,
              publicId,
              companyId,
              authorId,
              status: UpdateStatusEnum.PRIVATE,
            },
          });
          // @TODO(Update it in background after email sent only, not sure)
          const recipients = stakeholders.map((sh) => ({
            stakeholderId: sh.id,
            updateId: update.id,
          }));
          await tx.updateRecipient.createMany({
            data: recipients,
            skipDuplicates: true,
          });
          await Audit.create(
            {
              action: "update.saved",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                requestIp,
                userAgent,
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} saved & send the email updates.`,
            },
            tx,
          );
          await investorUpdateEmailJob.invoke({ ...input.payload, publicId });
        });
        return {
          success: true,
          message: "Successfully saved & emailed the update.",
          publicId,
        };
      }

      if (input.type === UpdateType.SEND_ONLY) {
        const { publicId, updateId, newStakeholders, isDraft } = input.payload;
        await ctx.db.$transaction(async (txn) => {
          if (isDraft) {
            await txn.update.update({
              where: {
                publicId,
              },
              data: {
                status: UpdateStatusEnum.PRIVATE,
              },
            });
          }
          const newRecipients = newStakeholders.map((sh) => ({
            updateId,
            stakeholderId: sh.id,
          }));
          // @TODO(Update it in background after email sent only, not sure)
          await txn.updateRecipient.createMany({
            data: newRecipients,
            skipDuplicates: true,
          });
          await Audit.create(
            {
              action: "update.sent",
              companyId,
              actor: { type: "user", id: ctx.session.user.id },
              context: {
                requestIp,
                userAgent,
              },
              target: [{ type: "company", id: companyId }],
              summary: `${ctx.session.user.name} send the email update to investors.`,
            },
            txn,
          );
          await investorUpdateEmailJob.invoke({
            ...input.payload,
            stakeholders: newStakeholders,
          });
        });
        return {
          success: true,
          message: "Successfully emailed the update.",
          publicId,
        };
      }

      return {
        success: false,
        message: "",
        publicId: "",
      };
    } catch (error) {
      console.error("Error handling investor updates", error);
      return {
        success: false,
        message: "Uhh oh!! Something went wrong.",
        publicId: "",
      };
    }
  });
