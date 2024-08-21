import AccountVerificationEmail from "@/emails/AccountVerificationEmail";
import { env } from "@/env";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";

const config = defineWorkerConfig({
  name: "email.auth-verify",
  schema: z.object({
    email: z.string(),
    token: z.string(),
  }),
});

export const authVerificationEmailJob = defineJob(config);
export const authVerificationEmailWorker = defineWorker(config, async (job) => {
  const { email, token } = job.data;
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
});
