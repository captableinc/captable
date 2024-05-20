import ESignConfirmationEmail from "@/emails/EsignConfirmationEmail";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type ConfirmationEmailPayloadType = {
  fileUrl: string;
  documentName: string;
  senderName: string | null;
  company: {
    name: string;
    logo?: string | null;
  };
  recipient: { name?: string | null; email: string };
};

export const sendEsignConfirmationEmail = async (
  payload: ConfirmationEmailPayloadType,
) => {
  const html = await render(
    ESignConfirmationEmail({
      documentName: payload.documentName,
      recipient: payload.recipient,
      senderName: payload.senderName,
      company: payload.company,
    }),
  );
  await sendMail({
    to: payload.recipient.email,
    subject: "Completed e-signed documents from all parties",
    html,
    attachments: [
      {
        filename: payload.documentName,
        path: payload.fileUrl,
      },
    ],
  });
};

export class EsignConfirmationEmailJob extends BaseJob<ConfirmationEmailPayloadType> {
  readonly type = "email.esign-confirmation";

  async work(job: Job<ConfirmationEmailPayloadType>): Promise<void> {
    await sendEsignConfirmationEmail(job.data);
  }
}
