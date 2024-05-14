import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import { env } from "@/env";
import { BaseJob } from "@/lib/pg-boss-base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

export type TAuthVerificationPayloadSchema = {
  email: string;
  token: string;
};

export const sendAuthVerificationEmail = async (
  payload: TAuthVerificationPayloadSchema,
) => {
  const { email, token } = payload;
  const baseUrl = env.BASE_URL;

  const confirmLink = `${baseUrl}/verify-email/${token}`;

  const html = await render(
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

export class AuthVerificationEmailJob extends BaseJob<TAuthVerificationPayloadSchema> {
  readonly type = "email.auth-verify";

  async work(job: Job<TAuthVerificationPayloadSchema>): Promise<void> {
    await sendAuthVerificationEmail(job.data);
  }
}
