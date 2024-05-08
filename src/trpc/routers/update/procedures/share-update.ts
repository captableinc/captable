import { env } from "@/env";
import {
  sendUpdateShareEmail,
  triggerName,
  type UpdateSharePayloadType,
} from "@/jobs/update-share-email";
import { encode } from "@/lib/jwt";
import { ShareRecipientSchema } from "@/schema/contacts";
import { getTriggerClient } from "@/trigger";
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
    const trigger = getTriggerClient();
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
          recipientId: recipientRecord.id,
        });

        const link = `${baseUrl}/update/${update.publicId}?token=${token}`;

        const payload: UpdateSharePayloadType = {
          senderName: senderName!,
          recipientName: recipient.name,
          companyName: company.name,
          dataRoom: dataRoom.name,
          link,
          email,
          senderEmail,
        };

        if (trigger) {
          await trigger.sendEvent({ name: triggerName, payload });
        } else {
          await sendUpdateShareEmail(payload);
        }
      }
    };

    await upsertManyRecipients();

    return {
      success: true,
      message: "Data room successfully shared!",
    };
  });
