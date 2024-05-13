import { encode } from "@/lib/jwt";
import { withAuth } from "@/trpc/api/trpc";
import { z } from "zod";

export const getUpdatesProcedure = withAuth.query(async ({ ctx }) => {
  const {
    db,
    session: { user },
  } = ctx;

  const data = await db.update.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
});

export const getRecipientsProcedure = withAuth
  .input(z.object({ updateId: z.string(), publicUpdateId: z.string() }))
  .query(async ({ ctx, input }) => {
    const {
      db,
      session: { user },
    } = ctx;

    const { updateId } = input;
    const { companyId } = user;

    const data = await db.updateRecipient.findMany({
      where: {
        update: {
          id: updateId,
          companyId: companyId,
        },
      },
    });

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
