import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import { and, companies, db, eq, shares, stakeholders } from "@captable/db";
import { TRPCError } from "@trpc/server";
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
  ctx: { session, requestIp, userAgent },
  input,
}: deleteShareHandlerOptions) {
  const user = session.user;
  const { shareId } = input;
  try {
    await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      // Get share details before deletion for audit
      const shareResult = await tx
        .select({
          id: shares.id,
          stakeholderName: stakeholders.name,
          companyName: companies.name,
        })
        .from(shares)
        .leftJoin(stakeholders, eq(shares.stakeholderId, stakeholders.id))
        .leftJoin(companies, eq(shares.companyId, companies.id))
        .where(and(eq(shares.id, shareId), eq(shares.companyId, companyId)))
        .limit(1);

      const share = shareResult[0];
      if (!share) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Share not found",
        });
      }

      // Delete the share
      await tx
        .delete(shares)
        .where(and(eq(shares.id, shareId), eq(shares.companyId, companyId)));

      await Audit.create(
        {
          action: "share.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "share", id: share.id }],
          summary: `${user.name} deleted share of stakeholder ${share.stakeholderName}`,
        },
        tx,
      );
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Oops, something went wrong while deleting share.",
    };
  }
}
