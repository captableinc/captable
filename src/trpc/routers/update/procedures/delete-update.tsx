import { Audit } from "@/server/audit";
import { type withAuthTrpcContextType, withAuth } from "@/trpc/api/trpc";
import { type Prisma } from "@prisma/client";
import {
  type TypeZodDeleteUpdateProcedure,
  ZodDeleteUpdateProcedure,
} from "../schema";

export const deleteUpdateProcedure = withAuth
  .input(ZodDeleteUpdateProcedure)
  .mutation(async (args) => {
    return await deleteUpdateHandler(args);
  });

interface deleteUpdateHandlerOptions {
  input: TypeZodDeleteUpdateProcedure;
  ctx: withAuthTrpcContextType;
}

export async function deleteUpdateHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: deleteUpdateHandlerOptions) {
  const user = session.user;
  const { updateId, publicId } = input;
  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const update = await tx.update.delete({
        where: {
          id: updateId,
          publicId,
          companyId: session.user.companyId,
        },
        select: {
          id: true,
        },
      });
      await Audit.create(
        {
          action: "update.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "company", id: update.id }],
          summary: `${user.name} deleted the investor update.`,
        },
        tx,
      );
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Oops, something went wrong while deleting update.",
    };
  }
}
