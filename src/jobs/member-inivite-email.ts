import MemberInviteEmail from "@/emails/MemberInviteEmail";
import { env } from "@/env";
import { constants } from "@/lib/constants";
import { BaseJob } from "@/lib/pg-boss-base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

type TSchema = {
  email: string;
  token: string;
  user: {
    email?: string | null | undefined;
    name?: string | null | undefined;
  };
  verificationToken: string;
  company: {
    name: string;
    id: string;
  };
};

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

export class SendMemberInviteEmailJob extends BaseJob<TSchema> {
  readonly type = "email.password-reset";

  async work(job: Job<TSchema>): Promise<void> {
    await sendMemberInviteEmail(job.data);
  }
}
