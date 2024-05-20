import MemberInviteEmail from "@/emails/MemberInviteEmail";
import { env } from "@/env";
import { BaseJob } from "@/jobs/base";
import { constants } from "@/lib/constants";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

type MemberInvitePayloadType = {
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

export const sendMemberInviteEmail = async (
  payload: MemberInvitePayloadType,
) => {
  const { email, token, verificationToken, company, user } = payload;

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
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
        invitedBy: `${user.name || user.email}`,
      }),
    ),
  });
};

export class SendMemberInviteEmailJob extends BaseJob<MemberInvitePayloadType> {
  readonly type = "email.password-reset";

  async work(job: Job<MemberInvitePayloadType>): Promise<void> {
    await sendMemberInviteEmail(job.data);
  }
}
