import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { env } from "@/env";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";

const config = defineWorkerConfig({
  name: "email.password-reset",
  schema: z.object({
    email: z.string(),
    token: z.string(),
  }),
});

export const passwordResetEmailJob = defineJob(config);
export const passwordResetEmailWorker = defineWorker(config, async (job) => {
  const { email, token } = job.data;
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
});
