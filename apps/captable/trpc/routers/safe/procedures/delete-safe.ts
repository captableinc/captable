import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import { and, companies, db, eq, safes, stakeholders } from "@captable/db";
import { TRPCError } from "@trpc/server";
import {
  type TypeZodDeleteSafesMutationSchema,
  ZodDeleteSafesMutationSchema,
} from "../schema";

export const deleteSafeProcedure = withAuth
  .input(ZodDeleteSafesMutationSchema)
  .mutation(async (args) => {
    return await deleteSafeHandler(args);
  });

interface deleteSafeHandlerOptions {
  input: TypeZodDeleteSafesMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function deleteSafeHandler({
  ctx: { session, requestIp, userAgent },
  input,
}: deleteSafeHandlerOptions) {
  const user = session.user;
  const { safeId } = input;
  try {
    await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session });

      // Get safe details before deletion for audit
      const safeResult = await tx
        .select({
          id: safes.id,
          stakeholderName: stakeholders.name,
          companyName: companies.name,
        })
        .from(safes)
        .leftJoin(stakeholders, eq(safes.stakeholderId, stakeholders.id))
        .leftJoin(companies, eq(safes.companyId, companies.id))
        .where(and(eq(safes.id, safeId), eq(safes.companyId, companyId)))
        .limit(1);

      const safe = safeResult[0];
      if (!safe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Safe not found",
        });
      }

      // Delete the safe
      await tx
        .delete(safes)
        .where(and(eq(safes.id, safeId), eq(safes.companyId, companyId)));

      await Audit.create(
        {
          action: "safe.deleted",
          companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "company", id: companyId }],
          summary: `${user.name} deleted safe agreement of stakeholder ${safe.stakeholderName}`,
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
