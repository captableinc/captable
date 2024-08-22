import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { env } from "@/env";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import type { Job } from "pg-boss";

export type PasswordResetPayloadType = {
  email: string;
  token: string;
};

export const sendPasswordResetEmail = async (
  payload: PasswordResetPayloadType,
) => {
  const { email, token } = payload;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const confirmLink = `${baseUrl}/reset-password/${token}`;

  const html = await renderAsync(
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
