import { env } from "@/env";
import {
  ShareUpdateEmailJob,
  type ShareUpdateEmailPayloadType,
} from "@/jobs/share-update-email";
import { encode } from "@/lib/jwt";
import { ShareRecipientSchema } from "@/schema/contacts";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  UpdateStatusEnum,
  and,
  companies,
  db,
  eq,
  updateRecipients,
  updates,
} from "@captable/db";
import { TRPCError } from "@trpc/server";
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
    const { session, userAgent, requestIp } = ctx;
    const { updateId, others, selectedContacts } = input;
    const { name: senderName, email: _senderEmail, id } = session.user;

    const { companyId } = await checkMembership({ session, tx: db });

    const updateResult = await db
      .select({
        id: updates.id,
        title: updates.title,
        publicId: updates.publicId,
        status: updates.status,
        companyName: companies.name,
      })
      .from(updates)
      .leftJoin(companies, eq(updates.companyId, companies.id))
      .where(and(eq(updates.id, updateId), eq(updates.companyId, companyId)))
      .limit(1);

    const update = updateResult[0];
    if (!update) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Update not found",
      });
    }

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

        // Check if recipient already exists
        const existingRecipient = await db
          .select()
          .from(updateRecipients)
          .where(
            and(
              eq(updateRecipients.updateId, updateId),
              eq(updateRecipients.email, email),
            ),
          )
          .limit(1);

        let recipientRecord: typeof updateRecipients.$inferSelect;
        if (existingRecipient.length > 0) {
          // Update existing recipient
          const existingId = existingRecipient[0]?.id;
          if (!existingId) {
            throw new Error("Existing recipient ID not found");
          }

          const [updated] = await db
            .update(updateRecipients)
            .set({
              name: recipient.name,
              ...memberOrStakeholderId,
              updatedAt: new Date(),
            })
            .where(eq(updateRecipients.id, existingId))
            .returning();

          if (!updated) {
            throw new Error("Failed to update recipient");
          }
          recipientRecord = updated;
        } else {
          // Create new recipient
          const [created] = await db
            .insert(updateRecipients)
            .values({
              updateId,
              name: recipient.name,
              email,
              ...memberOrStakeholderId,
              updatedAt: new Date(),
            })
            .returning();

          if (!created) {
            throw new Error("Failed to create recipient");
          }
          recipientRecord = created;
        }

        const token = await encode({
          companyId,
          updateId,
          publicId: update.publicId,
          recipientId: recipientRecord.id,
        });

        const link = `${baseUrl}/updates/${update.publicId}?token=${token}`;

        const payload: ShareUpdateEmailPayloadType = {
          to: email,
          senderName: `${senderName}`,
          recipientName: recipient.name ?? null,
          companyName: update.companyName || "",
          updateTitle: update.title,
          link,
        };

        await new ShareUpdateEmailJob().emit(payload);
      }
    };

    await upsertManyRecipients();

    if (update.status === UpdateStatusEnum.enumValues[0]) {
      // DRAFT
      await db
        .update(updates)
        .set({
          status: "PRIVATE",
          updatedAt: new Date(),
        })
        .where(eq(updates.id, updateId));
    }

    await Audit.create(
      {
        action: "update.shared",
        companyId: companyId,
        actor: { type: "user", id },
        context: {
          userAgent,
          requestIp: requestIp || "",
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
    const { session, userAgent, requestIp } = ctx;
    const { updateId, recipientId } = input;
    const companyId = session.user.companyId;
    const { user } = session;

    const updateResult = await db
      .select({
        id: updates.id,
        title: updates.title,
      })
      .from(updates)
      .where(and(eq(updates.id, updateId), eq(updates.companyId, companyId)))
      .limit(1);

    const update = updateResult[0];
    if (!update) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Update not found",
      });
    }

    await db
      .delete(updateRecipients)
      .where(
        and(
          eq(updateRecipients.id, recipientId),
          eq(updateRecipients.updateId, updateId),
        ),
      );

    await Audit.create(
      {
        action: "update.unshared",
        companyId: companyId,
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp: requestIp || "",
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
