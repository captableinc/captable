import { env } from "@/env";
import {
  ShareUpdateEmailJob,
  type UpdateSharePayloadType,
} from "@/jobs/share-update-email";
import { encode } from "@/lib/jwt";
import { ShareRecipientSchema } from "@/schema/contacts";
import { withAuth } from "@/trpc/api/trpc";
import { z } from "zod";

export const shareUpdateProcedure = withAuth
  .input(
    z.object({
      updateId: z.string(),
      others: z.array(ShareRecipientSchema),
      selectedContacts: z.array(ShareRecipientSchema),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { session, db } = ctx;
    const { updateId, others, selectedContacts } = input;
    const { name: senderName, email: senderEmail, companyId } = session.user;

    const update = await db.update.findUniqueOrThrow({
      where: {
        id: updateId,
        companyId,
      },

      include: {
        company: true,
      },
    });

    if (!update) {
      throw new Error("Data room not found");
    }

    const company = update.company;

    const upsertManyRecipients = async () => {
      const baseUrl = env.BASE_URL;
      const recipients = [...others, ...selectedContacts];

      for (const recipient of recipients) {
        const email = (recipient.email || recipient.value).trim();
        if (!email) {
          throw new Error("Email is required");
        }

        const memberOrStakeholderId =
          recipient.type === "member"
            ? { memberId: recipient.id }
            : recipient.type === "stakeholder"
              ? { stakeholderId: recipient.id }
              : {};

        const recipientRecord = await db.updateRecipient.upsert({
          where: {
            updateId_email: {
              updateId,
              email,
            },
          },
          create: {
            updateId,
            name: recipient.name,
            email,
            ...memberOrStakeholderId,
          },
          update: {
            name: recipient.name,
            ...memberOrStakeholderId,
          },
        });

        const token = await encode({
          companyId,
          updateId,
          publicId: update.publicId,
          recipientId: recipientRecord.id,
        });

        const link = `${baseUrl}/updates/${update.publicId}?token=${token}`;

        const payload: UpdateSharePayloadType = {
          senderName: senderName!,
          recipientName: recipient.name,
          companyName: company.name,
          update: {
            title: update.title,
          },
          link,
          email,
          senderEmail,
        };

        await new ShareUpdateEmailJob().emit(payload);
      }
    };

    await upsertManyRecipients();
    await db.update.update({
      where: {
        id: updateId,
      },
      data: {
        status: "PRIVATE",
      },
    });

    return {
      success: true,
      message: "Data room successfully shared!",
    };
  });

export const unshareUpdateProcedure = withAuth
  .input(
    z.object({
      updateId: z.string(),
      recipientId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { session, db } = ctx;
    const { updateId, recipientId } = input;
    const companyId = session.user.companyId;

    const update = await db.update.findUniqueOrThrow({
      where: {
        id: updateId,
        companyId,
      },
    });

    if (!update) {
      throw new Error("Update not found");
    }

    await db.updateRecipient.delete({
      where: {
        id: recipientId,
        updateId,
      },
    });

    return {
      success: true,
      message: `Successfully removed access to - ${update.title}`,
    };
  });
