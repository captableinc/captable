import { env } from "@/env";
import { MemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { generatePasswordResetToken } from "@/lib/token";
import { Audit } from "@/server/audit";
import { getRoleById } from "@/server/member";
import { generateInviteToken, generateMemberIdentifier } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
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
import { ZodInviteMemberMutationSchema } from "../schema";

export const inviteMemberProcedure = withAccessControl
  .input(ZodInviteMemberMutationSchema)
  .meta({
    policies: {
      members: { allow: ["create"] },
    },
  })
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { name, email, title, roleId } = input;
    const {
      userAgent,
      requestIp,
      membership: { companyId },
    } = ctx;

    const { expires, memberInviteTokenHash } = await generateInviteToken();

    const passwordResetTokenResult = await generatePasswordResetToken(email);

    if (!passwordResetTokenResult) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate password reset token",
      });
    }

    const { company, verificationToken } = await db.transaction(async (tx) => {
      // Get company details
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

      // Check if user exists, if not create user
      let invitedUser: { id: string };
      const [existingUser] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        invitedUser = existingUser;
      } else {
        const [newUser] = await tx
          .insert(users)
          .values({
            name,
            email,
            lastSignedIn: new Date(),
          })
          .returning({ id: users.id });

        if (!newUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        }
        invitedUser = newUser;
      }

      // Check if user is already a member
      const [prevMember] = await tx
        .select({ status: members.status })
        .from(members)
        .where(
          and(
            eq(members.companyId, companyId),
            eq(members.userId, invitedUser.id),
          ),
        )
        .limit(1);

      // If already an active member, throw error
      if (prevMember && prevMember.status === "ACTIVE") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "user already a member",
        });
      }

      const role = await getRoleById({ id: roleId, tx });

      // Create or update member
      let member: { id: string; userId: string };
      if (prevMember) {
        // Update existing member
        const [updatedMember] = await tx
          .update(members)
          .set({
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            status: "PENDING",
            role: role.role as "ADMIN" | "CUSTOM" | null,
            customRoleId: role.customRoleId,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(members.companyId, companyId),
              eq(members.userId, invitedUser.id),
            ),
          )
          .returning({
            id: members.id,
            userId: members.userId,
          });

        if (!updatedMember) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update member",
          });
        }
        member = updatedMember;
      } else {
        // Create new member
        const [newMember] = await tx
          .insert(members)
          .values({
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            companyId,
            userId: invitedUser.id,
            status: "PENDING",
            role: role.role as "ADMIN" | "CUSTOM" | null,
            customRoleId: role.customRoleId,
            updatedAt: new Date(),
          })
          .returning({
            id: members.id,
            userId: members.userId,
          });

        if (!newMember) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create member",
          });
        }
        member = newMember;
      }

      // Get member user name for audit
      const [memberUser] = await tx
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, member.userId))
        .limit(1);

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
          action: "member.invited",
          companyId: company.id,
          actor: { type: "user", id: user.id },
          context: {
            requestIp: requestIp || "",
            userAgent,
          },
          target: [{ type: "user", id: member.userId }],
          summary: `${user.name} invited ${memberUser?.name} to join ${company.name}`,
        },
        tx,
      );

      return { verificationToken: createdToken.token, company };
    });

    const inviteLink = `${env.NEXT_PUBLIC_BASE_URL}/verify-member?token=${verificationToken}&passwordResetToken=${passwordResetTokenResult.token}`;

    const payload = {
      invitedBy: user.name || "Someone",
      companyName: company.name,
      inviteLink,
      email,
    };

    await new MemberInviteEmailJob().emit(payload);

    return { success: true };
  });
