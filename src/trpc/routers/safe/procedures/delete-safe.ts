import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
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
  ctx: { db, session, requestIp, userAgent },
  input,
}: deleteSafeHandlerOptions) {
  const user = session.user;
  const { safeId } = input;
  try {
    await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session });

      const safe = await tx.safe.delete({
        where: {
          id: safeId,
          companyId,
        },
        select: {
          id: true,
          signerStakeholder: {
            select: {
              stakeholder: {
                select: {
                  name: true,
                },
              },
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
          action: "safe.deleted",
          companyId,
          actor: { type: "user", id: session.user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "company", id: companyId }],
          summary: `${user.name} deleted safe agreement of stakholder ${safe.signerStakeholder.stakeholder.name}`,
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
