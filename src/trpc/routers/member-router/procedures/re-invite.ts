import { sendMemberInviteEmail } from "@/jobs/member-inivite-email";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import {
  generateInviteToken,
  generateMemberIdentifier,
  revokeExistingInviteTokens,
} from "@/server/member";
import { getTriggerClient } from "@/trigger";
import { withAuth } from "@/trpc/api/trpc";
import { ZodReInviteMutationSchema } from "../schema";

export const reInviteProcedure = withAuth
  .input(ZodReInviteMutationSchema)
  .mutation(async ({ ctx: { session, db, requestIp, userAgent }, input }) => {
    const user = session.user;
    const trigger = getTriggerClient();

    const { authTokenHash, expires, memberInviteTokenHash, token } =
      await generateInviteToken();

    const { company, verificationToken, email } = await db.$transaction(
      async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const company = await tx.company.findFirstOrThrow({
          where: {
            id: companyId,
          },
          select: {
            name: true,
            id: true,
          },
        });

        const member = await tx.member.findFirstOrThrow({
          where: {
            id: input.memberId,
            status: "PENDING",
            companyId,
          },

          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });

        const email = member.user.email;

        if (!email) {
          throw new Error("invited email not found");
        }

        await revokeExistingInviteTokens({
          memberId: member.id,
          email,
          tx,
        });

        // custom verification token for member invitation
        const { token: verificationToken } = await tx.verificationToken.create({
          data: {
            identifier: generateMemberIdentifier({
              email,
              memberId: member.id,
            }),
            token: memberInviteTokenHash,
            expires,
          },
        });

        // next-auth verification token
        await tx.verificationToken.create({
          data: {
            identifier: email,
            token: authTokenHash,
            expires,
          },
        });

        await Audit.create(
          {
            action: "member.re-invited",
            companyId: company.id,
            actor: { type: "user", id: user.id },
            context: {
              requestIp,
              userAgent,
            },
            target: [{ type: "user", id: member.userId }],
            summary: `${user.name} reinvited ${member.user?.name} to join ${company.name}`,
          },
          tx,
        );

        return { verificationToken, company, email };
      },
    );

    const payload = {
      verificationToken,
      token,
      email,
      company,
      user: {
        email: user.email,
        name: user.name,
      },
    };

    if (trigger) {
      await trigger.sendEvent({ name: "email.member-invite", payload });
    } else {
      await sendMemberInviteEmail(payload);
    }

    return { success: true };
  });
