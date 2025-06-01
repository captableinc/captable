import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import { and, companies, db, eq, options, stakeholders } from "@captable/db";
import { TRPCError } from "@trpc/server";
import {
  type TypeZodDeleteOptionMutationSchema,
  ZodDeleteOptionMutationSchema,
} from "../schema";

export const deleteOptionProcedure = withAuth
  .input(ZodDeleteOptionMutationSchema)
  .mutation(async (args) => {
    return await deleteOptionHandler(args);
  });

interface deleteOptionHandlerOptions {
  input: TypeZodDeleteOptionMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function deleteOptionHandler({
  ctx: { session, requestIp, userAgent },
  input,
}: deleteOptionHandlerOptions) {
  const user = session.user;
  const { optionId } = input;
  try {
    await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      // Get option details before deletion for audit
      const optionResult = await tx
        .select({
          id: options.id,
          stakeholderName: stakeholders.name,
          companyName: companies.name,
        })
        .from(options)
        .leftJoin(stakeholders, eq(options.stakeholderId, stakeholders.id))
        .leftJoin(companies, eq(options.companyId, companies.id))
        .where(and(eq(options.id, optionId), eq(options.companyId, companyId)))
        .limit(1);

      const option = optionResult[0];
      if (!option) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Option not found",
        });
      }

      // Delete the option
      await tx
        .delete(options)
        .where(and(eq(options.id, optionId), eq(options.companyId, companyId)));

      await Audit.create(
        {
          action: "option.deleted",
          companyId: user.companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "option", id: option.id }],
          summary: `${user.name} deleted stock option of stakeholder ${option.stakeholderName}`,
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
