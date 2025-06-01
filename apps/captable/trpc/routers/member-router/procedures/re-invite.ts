import { env } from "@/env";
import { MemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { generatePasswordResetToken } from "@/lib/token";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import {
  generateInviteToken,
  generateMemberIdentifier,
  revokeExistingInviteTokens,
} from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  and,
  companies,
  db,
  eq,
  members,
  users,
  verificationTokens,
} from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodReInviteMutationSchema } from "../schema";

export const reInviteProcedure = withAuth
  .input(ZodReInviteMutationSchema)
  .mutation(async ({ ctx: { session, requestIp, userAgent }, input }) => {
    const user = session.user;

    const { expires, memberInviteTokenHash } = await generateInviteToken();

    const { company, verificationToken, email, passwordResetToken } =
      await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const [company] = await tx
          .select({
            name: companies.name,
            id: companies.id,
          })
          .from(companies)
          .where(eq(companies.id, companyId))
          .limit(1);

        if (!company) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Company not found",
          });
        }

        const memberResult = await tx
          .select({
            id: members.id,
            userId: members.userId,
            userName: users.name,
            userEmail: users.email,
          })
          .from(members)
          .innerJoin(users, eq(members.userId, users.id))
          .where(
            and(
              eq(members.id, input.memberId),
              eq(members.status, "PENDING"),
              eq(members.companyId, companyId),
            ),
          )
          .limit(1);

        const member = memberResult[0];
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }

        const email = member.userEmail;

        if (!email) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "invited email not found",
          });
        }

        await revokeExistingInviteTokens({
          memberId: member.id,
          email,
          tx,
        });

        // Create verification token for member invitation
        const [createdToken] = await tx
          .insert(verificationTokens)
          .values({
            secondaryId: generateMemberIdentifier({
              email,
              memberId: member.id,
            }),
            identifier: generateMemberIdentifier({
              email,
              memberId: member.id,
            }),
            token: memberInviteTokenHash,
            expires,
          })
          .returning({ token: verificationTokens.token });

        if (!createdToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create verification token",
          });
        }

        await Audit.create(
          {
            action: "member.re-invited",
            companyId: company.id,
            actor: { type: "user", id: user.id },
            context: {
              requestIp: requestIp || "",
              userAgent,
            },
            target: [{ type: "user", id: member.userId }],
            summary: `${user.name} reinvited ${member.userName} to join ${company.name}`,
          },
          tx,
        );

        const passwordResetTokenResult =
          await generatePasswordResetToken(email);
        if (!passwordResetTokenResult) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate password reset token",
          });
        }

        return {
          verificationToken: createdToken.token,
          company,
          email,
          passwordResetToken: passwordResetTokenResult.token,
        };
      });

    const inviteLink = `${env.NEXT_PUBLIC_BASE_URL}/verify-member?token=${verificationToken}&passwordResetToken=${passwordResetToken}`;

    const payload = {
      invitedBy: user.name || "Someone",
      companyName: company.name,
      inviteLink,
      email: email,
    };

    await new MemberInviteEmailJob().emit(payload);

    return { success: true };
  });
