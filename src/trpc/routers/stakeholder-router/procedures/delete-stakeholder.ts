import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth, type withAuthTrpcContextType } from "@/trpc/api/trpc";
import {
  type TypeZodDeleteStakeholderMutationSchema,
  ZodDeleteStakeholderMutationSchema,
} from "../schema";

export const deleteStakeholderProcedure = withAuth
  .input(ZodDeleteStakeholderMutationSchema)
  .mutation(async (args) => {
    return await deleteStakeholderHandler(args);
  });

interface deleteStakeholderHandlerOptions {
  input: TypeZodDeleteStakeholderMutationSchema;
  ctx: withAuthTrpcContextType;
}

export async function deleteStakeholderHandler({
  ctx: { db, session, requestIp, userAgent },
  input,
}: deleteStakeholderHandlerOptions) {
  const user = session.user;
  const { id: stakeholderId } = input;

  try {
    return await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      // There are no DB-level foreign keys (Prisma relationMode = "prisma"), so a
      // delete will not cascade. Refuse to remove an investor who still holds
      // securities, otherwise those rows would be orphaned and break the cap table.
      const [shares, options, safes, convertibleNotes, investments] =
        await Promise.all([
          tx.share.count({ where: { stakeholderId, companyId } }),
          tx.option.count({ where: { stakeholderId, companyId } }),
          tx.safe.count({ where: { stakeholderId, companyId } }),
          tx.convertibleNote.count({ where: { stakeholderId, companyId } }),
          tx.investment.count({ where: { stakeholderId, companyId } }),
        ]);

      if (shares + options + safes + convertibleNotes + investments > 0) {
        return {
          success: false,
          message:
            "This investor still holds securities (shares, options, SAFEs, notes or investments). Remove those first, then delete the investor.",
        };
      }

      // Clean up access-grant links that point at this stakeholder.
      await tx.dataRoomRecipient.deleteMany({ where: { stakeholderId } });
      await tx.updateRecipient.deleteMany({ where: { stakeholderId } });

      const stakeholder = await tx.stakeholder.delete({
        where: {
          id: stakeholderId,
          companyId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      await Audit.create(
        {
          action: "stakeholder.deleted",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "stakeholder", id: stakeholder.id }],
          summary: `${user.name} removed stakeholder ${stakeholder.name}`,
        },
        tx,
      );

      return {
        success: true,
        message: "Successfully removed the stakeholder",
      };
    });
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Oops, something went wrong while removing the stakeholder.",
    };
  }
}
