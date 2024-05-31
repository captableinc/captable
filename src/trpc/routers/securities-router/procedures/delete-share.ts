import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodDeleteShareMutationSchema,
  ZodDeleteShareMutationSchema,
} from "../schema";

export const deleteShareProcedure = withAuth
  .input(ZodDeleteShareMutationSchema)
  .mutation(async (args) => {
    return await deleteShareHandler(args);
  });

interface deleteShareHandlerOptions {
  input: TypeZodDeleteShareMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function deleteShareHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: deleteShareHandlerOptions) {
  const user = session.user;
  const { shareId } = input;
  try {
    await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const share = await tx.share.delete({
        where: {
          id: shareId,
          companyId,
        },
        select: {
          id: true,
          stakeholder: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      await Audit.create(
        {
          action: "share.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${user.name} deleted share of stakholder ${share.stakeholder.name}`,
        },
        tx,
      );
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Oops, something went wrong while deleting option.",
    };
  }
}
