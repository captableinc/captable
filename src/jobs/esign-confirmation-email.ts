import ESignConfirmationEmail from "@/emails/EsignConfirmationEmail";
import { BaseJob } from "@/lib/pg-boss-base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

export type TConfirmationEmailPayload = {
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
  payload: TConfirmationEmailPayload,
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

export class EsignConfirmationEmailJob extends BaseJob<TConfirmationEmailPayload> {
  readonly type = "email.esign-confirmation";

  async work(job: Job<TConfirmationEmailPayload>): Promise<void> {
    await sendEsignConfirmationEmail(job.data);
  }
}
