import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { revokeExistingInviteTokens } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { companies, db, eq, members, users } from "@captable/db";
import { ZodRevokeInviteMutationSchema } from "../schema";
import { removeMemberHandler } from "./remove-member";

export const revokeInviteProcedure = withAuth
  .input(ZodRevokeInviteMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { session, requestIp, userAgent } = ctx;
    const user = session.user;
    const { memberId, email } = input;

    await db.transaction(async (tx) => {
      await checkMembership({ session, tx });

      await revokeExistingInviteTokens({ memberId, email, tx });

      const memberResult = await tx
        .select({
          userId: members.userId,
          userName: users.name,
          companyName: companies.name,
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id))
        .leftJoin(companies, eq(members.companyId, companies.id))
        .where(eq(members.id, memberId))
        .limit(1);

      const member = memberResult[0];

      await Audit.create(
        {
          action: "member.revoked-invite",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "user", id: member?.userId }],
          summary: `${user.name} revoked ${member?.userName} to join ${member?.companyName}`,
        },
        tx,
      );

      await removeMemberHandler({
        ctx: { ...ctx, db: tx },
        input: { memberId: input.memberId },
      });
    });

    return { success: true };
  });
