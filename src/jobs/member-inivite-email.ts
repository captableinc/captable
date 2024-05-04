import MemberInviteEmail from "@/emails/MemberInviteEmail";
import { env } from "@/env";
import { constants } from "@/lib/constants";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  token: z.string(),
  verificationToken: z.string(),
  company: z.object({
    name: z.string(),
    id: z.string(),
  }),
  user: z.object({
    email: z.string().email().nullish(),
    name: z.string().nullish(),
  }),
});

type TSchema = z.infer<typeof schema>;

export const sendMemberInviteEmail = async (payload: TSchema) => {
  const { email, token, verificationToken, company, user } = payload;

  const baseUrl = env.BASE_URL;
  const callbackUrl = `${baseUrl}/verify-member/${verificationToken}`;

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
};

client.defineJob({
  id: "member-inivte-email",
  name: "member invite email",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "email.member-invite",
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask("send member invite email", async () => {
      await sendMemberInviteEmail(payload);
    });
  },
});
