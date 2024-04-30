import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import {
  generateInviteToken,
  generateMemberIdentifier,
  sendMemberInviteEmail,
} from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { ZodInviteMemberMutationSchema } from "../schema";

export const inviteMemberProcedure = withAuth
  .input(ZodInviteMemberMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { name, email, title } = input;
    const { userAgent, requestIp, session } = ctx;

    //token flow same as https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/actions/signin/send-token.ts#L12C4-L12C4
    const { authTokenHash, expires, memberInviteTokenHash, token } =
      await generateInviteToken();

    const { company, verificationToken } = await ctx.db.$transaction(
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

        //  create member
        const member = await tx.member.upsert({
          create: {
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            companyId,
            userId: invitedUser.id,
            status: "PENDING",
          },
          update: {
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            status: "PENDING",
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

    await sendMemberInviteEmail({
      verificationToken,
      token,
      email,
      company,
      user: {
        email: user.email,
        name: user.name,
      },
    });

    return { success: true };
  });
