import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import { env } from "@/env";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import type { Job } from "pg-boss";

export type AuthVerificationPayloadType = {
  email: string;
  token: string;
};

export const sendAuthVerificationEmail = async (
  payload: AuthVerificationPayloadType,
) => {
  const { email, token } = payload;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const confirmLink = `${baseUrl}/verify-email/${token}`;

  const html = await renderAsync(
    AccountVerificationEmail({
      verifyLink: confirmLink,
    }),
  );

  await sendMail({
    to: email,
    subject: "Confirm your email",
    html,
  });
};

export class AuthVerificationEmailJob extends BaseJob<AuthVerificationPayloadType> {
  readonly type = "email.auth-verify";

  async work(job: Job<AuthVerificationPayloadType>): Promise<void> {
    await sendAuthVerificationEmail(job.data);
  }
}
