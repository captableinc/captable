import { sendMemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { getRoleById } from "@/lib/rbac/access-control";
import { generatePasswordResetToken } from "@/lib/token";
import { Audit } from "@/server/audit";
import { generateInviteToken, generateMemberIdentifier } from "@/server/member";
import { withAccessControl } from "@/trpc/api/trpc";
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

    const { token: passwordResetToken } =
      await generatePasswordResetToken(email);

    const { company, verificationToken } = await ctx.db.$transaction(
      async (tx) => {
        const company = await tx.company.findFirstOrThrow({
          where: {
            id: companyId,
          },
          select: {
            name: true,
            id: true,
          },
        });

        // create or find user
        const invitedUser = await tx.user.upsert({
          where: {
            email,
          },
          update: {},
          create: {
            name,
            email,
          },
          select: {
            id: true,
          },
        });

        // check if user is already a member
        const prevMember = await tx.member.findUnique({
          where: {
            companyId_userId: {
              companyId,
              userId: invitedUser.id,
            },
          },
        });

        // if already a member, throw error
        if (prevMember && prevMember.status === "ACTIVE") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "user already a member",
          });
        }

        const role = await getRoleById({ id: roleId, tx });

        //  create member
        const member = await tx.member.upsert({
          create: {
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            companyId,
            userId: invitedUser.id,
            status: "PENDING",
            ...role,
          },
          update: {
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            status: "PENDING",
            ...role,
          },
          where: {
            companyId_userId: {
              companyId,
              userId: invitedUser.id,
            },
          },
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
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
            action: "member.invited",
            companyId: company.id,
            actor: { type: "user", id: user.id },
            context: {
              requestIp,
              userAgent,
            },
            target: [{ type: "user", id: member.userId }],
            summary: `${user.name} invited ${member.user?.name} to join ${company.name}`,
          },
          tx,
        );

        return { verificationToken, company };
      },
    );

    await sendMemberInviteEmailJob.emit({
      verificationToken,
      passwordResetToken,
      email,
      company,
      user: {
        email: user.email,
        name: user.name,
      },
    });

    return { success: true };
  });
