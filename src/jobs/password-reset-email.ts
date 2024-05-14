import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { env } from "@/env";
import { BaseJob } from "@/lib/pg-boss-base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

export type TPasswordResetPayloadSchema = {
  email: string;
  token: string;
};

export const sendPasswordResetEmail = async (
  payload: TPasswordResetPayloadSchema,
) => {
  const { email, token } = payload;
  const baseUrl = env.BASE_URL;

  const confirmLink = `${baseUrl}/reset-password/${token}`;

  const html = await render(
    PasswordResetEmail({
      resetLink: confirmLink,
    }),
  );

  await sendMail({
    to: email,
    subject: "Reset your password",
    html,
  });
};

export class PasswordResetEmailJob extends BaseJob<TPasswordResetPayloadSchema> {
  readonly type = "email.password-reset";

  async work(job: Job<TPasswordResetPayloadSchema>): Promise<void> {
    await sendPasswordResetEmail(job.data);
  }
}
