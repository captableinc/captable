import ESignConfirmationEmail from "@/emails/EsignConfirmationEmail";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import type { Job } from "pg-boss";

export type ConfirmationEmailPayloadType = {
  fileUrl: string;
  documentName: string;
  senderName: string | null;
  senderEmail: string | null;
  company: {
    name: string;
    logo?: string | null;
  };
  recipient: { name?: string | null; email: string };
};

export const sendEsignConfirmationEmail = async (
  payload: ConfirmationEmailPayloadType,
) => {
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
};

export class EsignConfirmationEmailJob extends BaseJob<ConfirmationEmailPayloadType> {
  readonly type = "email.esign-confirmation";

  async work(job: Job<ConfirmationEmailPayloadType>): Promise<void> {
    await sendEsignConfirmationEmail(job.data);
  }
}
