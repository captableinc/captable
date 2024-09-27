import SafeSigningEmail from "@/emails/SafeSigningEmail";
import { sendMail } from "@/server/mailer";
import { render } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";

const config = defineWorkerConfig({
  name: "email.safe-signing",
  schema: z.object({
    name: z.string(),
    companyName: z.string(),
    type: z.string(),
    investmentAmount: z.string(),
    token: z.string(),
    email: z.string(),
  }),
});

export const safeSigningEmailJob = defineJob(config);

export const safeSigningEmailWorker = defineWorker(config, async (job) => {
  const { companyName, investmentAmount, token, name, type, email } = job.data;

  await sendMail({
    to: email,
    subject: "Action Required: Complete Your SAFE Agreement",
    html: await render(
      SafeSigningEmail({
        companyName,
        investmentAmount,
        token,
        name,
        type,
      }),
    ),
  });
});
