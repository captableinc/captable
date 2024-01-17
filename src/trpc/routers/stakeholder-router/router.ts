import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";
import {
  ZodAcceptMemberMutationSchema,
  ZodInviteMemberMutationSchema,
} from "./schema";
import { nanoid } from "nanoid";
import { createHash } from "@/lib/crypto";
import { env } from "@/env";

import { MemberInviteEmail } from "@/emails/MemberInviteEmail";
import { sendMail } from "@/server/mailer";
import { constants } from "@/lib/constants";
import { render } from "jsx-email";

export const stakeholderRouter = createTRPCRouter({
  inviteMember: protectedProcedure
    .input(ZodInviteMemberMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      const token = nanoid(32);

      const secret = env.NEXTAUTH_SECRET;

      const ONE_DAY_IN_SECONDS = 86400;
      const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

      const company = await ctx.db.company.findFirstOrThrow({
        where: {
          id: ctx.session.user.companyId,
        },
      });

      await ctx.db.verificationToken.create({
        data: {
          identifier: email,
          token: await createHash(`${token}${secret}`),
          expires,
        },
      });

      const { token: memberToken } = await ctx.db.verificationToken.create({
        data: {
          identifier: `${company.id}:${email}`,
          token: await createHash(`member-${nanoid(16)}`),
          expires,
        },
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
            teamName: company.name,
            inviteLink,
            invitedByEmail: email,
            invitedByUsername: "",
          }),
        ),
      });

      return { success: true };
    }),

  acceptMember: protectedProcedure
    .input(ZodAcceptMemberMutationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });

      await ctx.db.membership.upsert({
        where: {
          userId_companyId: {
            companyId: input.companyId,
            userId: ctx.session.user.id,
          },
        },
        update: {},
        create: {
          companyId: input.companyId,
          userId: ctx.session.user.id,
          access: "READ",
          active: true,
          isOnboarded: true,
          lastAccessed: new Date(),
          status: "ACCEPTED",
          title: "",
        },
      });

      return { success: true };
    }),
});
