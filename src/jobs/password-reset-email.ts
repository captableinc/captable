import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { BaseJob } from "@/jobs/base";
import { getPublicEnv } from "@/lib/env";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type PasswordResetPayloadType = {
  email: string;
  token: string;
};

export const sendPasswordResetEmail = async (
  payload: PasswordResetPayloadType,
) => {
  const { email, token } = payload;
  const baseUrl = getPublicEnv("NEXT_PUBLIC_BASE_URL");

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

export class PasswordResetEmailJob extends BaseJob<PasswordResetPayloadType> {
  readonly type = "email.password-reset";

  async work(job: Job<PasswordResetPayloadType>): Promise<void> {
    await sendPasswordResetEmail(job.data);
  }
}
