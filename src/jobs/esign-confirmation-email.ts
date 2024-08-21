import ESignConfirmationEmail from "@/emails/EsignConfirmationEmail";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";

const Schema = z.object({
  fileUrl: z.string(),
  documentName: z.string(),
  senderName: z.string().nullable(),
  senderEmail: z.string().nullable(),
  company: z.object({
    name: z.string(),
    logo: z.string().nullish(),
  }),
  recipient: z.object({
    name: z.string().nullish(),
    email: z.string().email(),
  }),
});

const config = defineWorkerConfig({
  name: "email.esign-confirmation",
  schema: Schema,
});

export type TSchema = z.infer<typeof Schema>;

export const eSignConfirmationEmailJob = defineJob(config);
export const eSignConfirmationEmailWorker = defineWorker(
  config,
  async (job) => {
    const payload = job.data;

    const html = await renderAsync(
      ESignConfirmationEmail({
        documentName: payload.documentName,
        recipient: payload.recipient,
        senderName: payload.senderName,
        senderEmail: payload.senderEmail,
        company: payload.company,
      }),
    );
    await sendMail({
      to: payload.recipient.email,
      ...(payload.senderEmail && { replyTo: payload.senderEmail }),
      subject: "Completed e-signed documents from all parties",
      html,
      attachments: [
        {
          filename: payload.documentName,
          path: payload.fileUrl,
        },
      ],

      headers: {
        "X-From-Name": payload.senderName || "Captable",
      },
    });
  },
);
