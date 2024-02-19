import { withAuth } from "@/trpc/api/trpc";
import { ZodRevokeInviteMutationSchema } from "../schema";
import { revokeExistingInviteTokens } from "@/server/member";
import { Audit } from "@/server/audit";
import { removeMemberHandler } from "./remove-member";

export const revokeInviteProcedure = withAuth
  .input(ZodRevokeInviteMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, session, requestIp, userAgent } = ctx;
    const user = session.user;
    const { memberId, email } = input;

    await db.$transaction(async (tx) => {
      await revokeExistingInviteTokens({ memberId, email, tx });

      const member = await tx.member.findFirst({
        where: {
          id: memberId,
        },
        select: {
          userId: true,
          user: {
            select: {
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

      await Audit.create({
        action: "stakeholder.revoked-invite",
        companyId: user.companyId,
        actor: { type: "user", id: user.id },
        context: {
          requestIp,
          userAgent,
        },
        target: [{ type: "user", id: member?.userId }],
        summary: `${user.name} revoked ${member?.user?.name} to join ${member?.company?.name}`,
      });
    });

    await removeMemberHandler({
      ctx,
      input: { memberId: input.memberId },
    });

    return { success: true };
  });
