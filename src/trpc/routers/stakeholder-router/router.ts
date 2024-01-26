import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";
import {
  ZodAcceptMemberMutationSchema,
  ZodInviteMemberMutationSchema,
  ZodRemoveMemberMutationSchema,
  ZodRevokeInviteMutationSchema,
} from "./schema";
import { nanoid } from "nanoid";
import { createHash } from "@/lib/crypto";
import { env } from "@/env";

import { MemberInviteEmail } from "@/emails/MemberInviteEmail";
import { sendMail } from "@/server/mailer";
import { constants } from "@/lib/constants";
import { render } from "jsx-email";
import { TRPCError } from "@trpc/server";
import { generateMembershipIdentifier } from "@/server/stakeholder";

export const stakeholderRouter = createTRPCRouter({
  inviteMember: protectedProcedure
    .input(ZodInviteMemberMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { name, email, title, access } = input;

      //token flow same as https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/actions/signin/send-token.ts#L12C4-L12C4
      const token = nanoid(32);

      const secret = env.NEXTAUTH_SECRET;

      const ONE_DAY_IN_SECONDS = 86400;
      const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

      const { company, memberToken } = await ctx.db.$transaction(async (tx) => {
        const company = await tx.company.findFirstOrThrow({
          where: {
            id: user.companyId,
          },
          select: {
            name: true,
            id: true,
          },
        });

        const prevMembership = await tx.membership.findFirst({
          where: {
            companyId: company.id,
            invitedEmail: email,
            status: "accepted",
          },
        });

        if (prevMembership) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "user already a member",
          });
        }

        const membership = await tx.membership.upsert({
          where: {
            companyId_invitedEmail: {
              companyId: company.id,
              invitedEmail: email,
            },
          },
          update: {},
          create: {
            title,
            access: access ?? "stakeholder",
            companyId: company.id,
            invitedEmail: email,
            active: false,
            isOnboarded: false,
            lastAccessed: new Date(),
            status: "pending",
          },
          select: {
            id: true,
          },
        });

        // custom verification token for member invitation
        const { token: memberToken } = await tx.verificationToken.create({
          data: {
            identifier: generateMembershipIdentifier({
              email,
              membershipId: membership.id,
            }),
            token: await createHash(`member-${nanoid(16)}`),
            expires,
          },
        });

        // next-auth verification token
        await tx.verificationToken.create({
          data: {
            identifier: email,
            token: await createHash(`${token}${secret}`),
            expires,
          },
        });

        return { memberToken, company };
      });

      const baseUrl = process.env.NEXTAUTH_URL;
      const callbackUrl = `${baseUrl}/verify-member/${memberToken}`;

      const params = new URLSearchParams({
        callbackUrl,
        token,
        email,
      });

      const inviteLink = `${baseUrl}/api/auth/callback/email?${params.toString()}`;

      await sendMail({
        to: email,
        subject: `Join ${company.name} on ${constants.title}`,
        html: await render(
          MemberInviteEmail({
            inviteLink,
            companyName: company.name,
            invitedBy: (user.name ?? user.email)!,
          }),
        ),
      });

      return { success: true };
    }),

  acceptMember: protectedProcedure
    .input(ZodAcceptMemberMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const data = await ctx.db.$transaction([
        ctx.db.verificationToken.delete({
          where: {
            token: input.token,
          },
        }),
        ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: input.name,
          },
        }),
        ctx.db.membership.update({
          where: {
            id: input.membershipId,
          },
          data: {
            active: true,
            status: "accepted",
            lastAccessed: new Date(),
            isOnboarded: true,
            userId: user.id,
          },
          select: {
            company: {
              select: {
                publicId: true,
              },
            },
          },
        }),
      ]);

      return { success: true, publicId: data[2].company.publicId };
    }),

  revokeInvite: protectedProcedure
    .input(ZodRevokeInviteMutationSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const { membershipId, email } = input;

      const identifier = generateMembershipIdentifier({
        email,
        membershipId,
      });

      const verificationToken = await db.verificationToken.findFirstOrThrow({
        where: {
          identifier,
        },
      });
      await db.verificationToken.delete({
        where: {
          identifier,
          token: verificationToken.token,
        },
      });

      return { success: true };
    }),

  removeMember: protectedProcedure
    .input(ZodRemoveMemberMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const { membershipId } = input;

      await db.membership.delete({
        where: {
          id: membershipId,
          companyId: session.user.companyId,
        },
      });

      return { success: true };
    }),
});
