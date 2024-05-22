import MemberInviteEmail from "@/emails/MemberInviteEmail";
import { BaseJob } from "@/jobs/base";
import { constants } from "@/lib/constants";
import { getPublicEnv } from "@/lib/env";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

type MemberInvitePayloadType = {
  email: string;
  passwordResetToken: string;
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
  const { email, passwordResetToken, verificationToken, company, user } =
    payload;

  const baseUrl = getPublicEnv("NEXT_PUBLIC_BASE_URL");

  const params = new URLSearchParams({
    passwordResetToken,
    email,
  });

  const inviteLink = `${baseUrl}/verify-member/${verificationToken}?${params.toString()}`;
  console.log("sending invite email to", email, ": ", inviteLink);

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
  readonly type = "email.member-invite";

  async work(job: Job<MemberInvitePayloadType>): Promise<void> {
    await sendMemberInviteEmail(job.data);
  }
}
