import { adminOnlyProcedure } from "@/trpc/api/trpc";
import { ZodRevokeInviteMutationSchema } from "../schema";
import { revokeExistingInviteTokens } from "@/server/stakeholder";
import { Audit } from "@/server/audit";
import { removeMemberHandler } from "./remove-member";

export const revokeInviteProcedure = adminOnlyProcedure
  .input(ZodRevokeInviteMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;
    const user = session.user;
    const { membershipId, email } = input;

    await db.$transaction(async (tx) => {
      await revokeExistingInviteTokens({ membershipId, email, tx });

      const membership = await tx.membership.findFirst({
        where: {
          id: membershipId,
        },
        select: {
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          access: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      await Audit.create({
        action: "stakeholder.revoked-invite",
        companyId: user.companyId,
        actor: { type: "user", id: user.id },
        context: {},
        target: [{ type: "user", id: membership?.userId }],
        summary: `${user.name} revoked ${membership?.user?.name} to join ${membership?.company?.name} with ${membership?.access} access`,
      });
    });

    await removeMemberHandler({
      ctx,
      input: { membershipId: input.membershipId },
    });

    return { success: true };
  });
