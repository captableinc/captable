import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "./queue";

const Schema = z.object({
  documentName: z.string().optional(),
  message: z.string().nullish(),
  recipient: z.object({
    id: z.string(),
    name: z.string().nullish(),
    email: z.string().email(),
  }),
  sender: z
    .object({
      name: z.string().nullish(),
      email: z.string().email().nullish(),
    })
    .optional(),
  company: z
    .object({
      name: z.string(),
      logo: z.string().nullish(),
    })
    .optional(),
  email: z.string().email(),
  token: z.string(),
});

export type TESignNotificationEmailJobInput = z.infer<typeof Schema>;

const config = defineWorkerConfig({
  name: "email.esign-notification",
  schema: Schema,
});

export const eSignNotificationEmailJob = defineJob(config);
export const eSignNotificationEmailWorker = defineWorker(
  config,
  async (job) => {
    const { email, token, sender, ...rest } = job.data;
    const baseUrl = env.NEXT_PUBLIC_BASE_URL;

    await db.$transaction(async (tx) => {
      const recipient = await tx.esignRecipient.update({
        where: {
          id: job.data.recipient.id,
        },
        data: {
          status: "SENT",
        },
      });

      await tx.template.update({
        where: {
          id: recipient.templateId,
        },
        data: {
          status: "SENT",
        },
      });
    });

    const html = await renderAsync(
      EsignEmail({
        signingLink: `${baseUrl}/esign/${token}`,
        sender,
        ...rest,
      }),
    );
    await sendMail({
      to: email,
      ...(sender?.email && { replyTo: sender.email }),
      subject: "eSign Document Request",
      html,
      headers: {
        "X-From-Name": sender?.name || "Captable",
      },
    });
  },
);
