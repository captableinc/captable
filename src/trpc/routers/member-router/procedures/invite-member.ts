import { withAuth } from "@/trpc/api/trpc";
import { ZodInviteMemberMutationSchema } from "../schema";
import {
  generateInviteToken,
  generateMembershipIdentifier,
  sendMembershipInviteEmail,
} from "@/server/member";
import { TRPCError } from "@trpc/server";
import { Audit } from "@/server/audit";

export const inviteMemberProcedure = withAuth
  .input(ZodInviteMemberMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { name, email, title } = input;
    const { userAgent, requestIp } = ctx;

    //token flow same as https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/actions/signin/send-token.ts#L12C4-L12C4
    const { authTokenHash, expires, memberInviteTokenHash, token } =
      await generateInviteToken();

    const { company, verificationToken } = await ctx.db.$transaction(
      async (tx) => {
        const company = await tx.company.findFirstOrThrow({
          where: {
            id: user.companyId,
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
        const prevMembership = await tx.membership.findUnique({
          where: {
            companyId_userId: {
              companyId: user.companyId,
              userId: invitedUser.id,
            },
          },
        });

        // if already a member, throw error
        if (prevMembership && prevMembership.status === "ACTIVE") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "user already a member",
          });
        }

        //  create membership
        const membership = await tx.membership.upsert({
          create: {
            title,
            isOnboarded: false,
            lastAccessed: new Date(),
            companyId: user.companyId,
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
              companyId: user.companyId,
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
            identifier: generateMembershipIdentifier({
              email,
              membershipId: membership.id,
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
            action: "stakeholder.invited",
            companyId: company.id,
            actor: { type: "user", id: user.id },
            context: {
              requestIp,
              userAgent,
            },
            target: [{ type: "user", id: membership.userId }],
            summary: `${user.name} invited ${membership.user?.name} to join ${company.name}`,
          },
          tx,
        );

        return { verificationToken, company };
      },
    );

    await sendMembershipInviteEmail({
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
