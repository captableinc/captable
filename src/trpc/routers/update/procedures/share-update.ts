import { env } from "@/env";
import {
  ShareUpdateEmailJob,
  type UpdateSharePayloadType,
} from "@/jobs/share-update-email";
import { encode } from "@/lib/jwt";
import { UpdateStatusEnum } from "@/prisma/enums";
import { ShareRecipientSchema } from "@/schema/contacts";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
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
    const { session, db, userAgent, requestIp } = ctx;
    const { updateId, others, selectedContacts } = input;
    const { name: senderName, email: senderEmail, id } = session.user;

    const { companyId } = await checkMembership({ session, tx: db });

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
      throw new Error("Update found");
    }

    const company = update.company;

    const upsertManyRecipients = async () => {
      const baseUrl = env.NEXT_PUBLIC_BASE_URL;
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
          senderName: `${senderName}`,
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

    if (update.status === UpdateStatusEnum.DRAFT) {
      await db.update.update({
        where: {
          id: updateId,
        },
        data: {
          status: "PRIVATE",
        },
      });
    }

    await Audit.create(
      {
        action: "update.shared",
        companyId: companyId,
        actor: { type: "user", id },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "update", id: update.id }],
        summary: `${senderName} shared the Update ${update.title} for the company with id ${companyId}`,
      },
      db,
    );

    return {
      success: true,
      message: "Update successfully shared!",
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
    const { session, db, userAgent, requestIp } = ctx;
    const { updateId, recipientId } = input;
    const companyId = session.user.companyId;
    const { user } = session;

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

    await Audit.create(
      {
        action: "update.unshared",
        companyId: companyId,
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "update", id: update.id }],
        summary: `${user.name} shared the Update ${update.title} for the company with id ${companyId}`,
      },
      db,
    );

    return {
      success: true,
      message: `Successfully removed access to - ${update.title}`,
    };
  });
