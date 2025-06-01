import { encode } from "@/lib/jwt";
import { withAuth } from "@/trpc/api/trpc";
import { and, db, desc, eq, updateRecipients, updates } from "@captable/db";
import { z } from "zod";

export const getUpdatesProcedure = withAuth.query(async ({ ctx }) => {
  const {
    session: { user },
  } = ctx;

  const data = await db
    .select({
      id: updates.id,
      title: updates.title,
      content: updates.content,
      html: updates.html,
      publicId: updates.publicId,
      status: updates.status,
      public: updates.public,
      companyId: updates.companyId,
      authorId: updates.authorId,
      createdAt: updates.createdAt,
      updatedAt: updates.updatedAt,
    })
    .from(updates)
    .where(eq(updates.companyId, user.companyId))
    .orderBy(desc(updates.createdAt));

  // Get recipients for each update
  const dataWithRecipients = await Promise.all(
    data.map(async (update) => {
      const recipients = await db
        .select()
        .from(updateRecipients)
        .where(eq(updateRecipients.updateId, update.id));

      return {
        ...update,
        recipients,
      };
    }),
  );

  return { data: dataWithRecipients };
});

export const getRecipientsProcedure = withAuth
  .input(z.object({ updateId: z.string() }))
  .query(async ({ ctx, input }) => {
    const {
      session: { user },
    } = ctx;

    const { updateId } = input;
    const { companyId } = user;

    // First verify the update belongs to the company
    const updateResult = await db
      .select({ id: updates.id })
      .from(updates)
      .where(and(eq(updates.id, updateId), eq(updates.companyId, companyId)))
      .limit(1);

    if (!updateResult.length) {
      throw new Error("Update not found or access denied");
    }

    const data = await db
      .select()
      .from(updateRecipients)
      .where(eq(updateRecipients.updateId, updateId));

    const recipients = await Promise.all(
      data.map(async (recipient) => ({
        ...recipient,
        token: await encode({
          updateId,
          companyId,
          recipientId: recipient.id,
        }),
      })),
    );

    return recipients;
  });
