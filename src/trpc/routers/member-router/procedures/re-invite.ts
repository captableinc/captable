import { SendMemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { generatePasswordResetToken } from "@/lib/token";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import {
  generateInviteToken,
  generateMemberIdentifier,
  revokeExistingInviteTokens,
} from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { ZodReInviteMutationSchema } from "../schema";

export const reInviteProcedure = withAuth
  .input(ZodReInviteMutationSchema)
  .mutation(async ({ ctx: { session, db, requestIp, userAgent }, input }) => {
    const user = session.user;

    const { expires, memberInviteTokenHash } = await generateInviteToken();

    const { company, verificationToken, email, passwordResetToken } =
      await db.$transaction(async (tx) => {
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

        const { token: passwordResetToken } =
          await generatePasswordResetToken(email);

        return { verificationToken, company, email, passwordResetToken };
      });

    const payload = {
      verificationToken,
      passwordResetToken,
      email,
      company,
      user: {
        email: user.email,
        name: user.name,
      },
    };

    await new SendMemberInviteEmailJob().emit(payload);

    return { success: true };
  });
