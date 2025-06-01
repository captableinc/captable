import { env } from "@/env";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { db, eq, esignRecipients, templates } from "@captable/db";
import type { Job } from "pg-boss";

export type EsignEmailPayloadType = {
  documentName?: string;
  message?: string | null;
  recipient: {
    id: string;
    name: string | null | undefined;
    email: string;
  };
  sender?: {
    name: string | null | undefined;
    email: string | null | undefined;
  };
  company?: {
    name: string;
    logo: string | null | undefined;
  };
  signingLink: string;
};

const sendEsignEmail = async (payload: EsignEmailPayloadType) => {
  // Dynamic import to avoid build-time processing
  const { render } = await import("@captable/email");
  const { EsignEmail } = await import("@captable/email/templates");

  const html = await render(
    EsignEmail({
      signingLink: payload.signingLink,
      documentName: payload.documentName,
      message: payload.message,
      recipient: payload.recipient,
      sender: payload.sender,
      company: payload.company,
    }),
  );

  await sendMail({
    to: [payload.recipient.email],
    subject: `${payload.sender?.name} has sent you a document to sign`,
    html,
  });
};

export class EsignEmailJob extends BaseJob<EsignEmailPayloadType> {
  readonly type = "email.esign-notification";

  async work(job: Job<EsignEmailPayloadType>): Promise<void> {
    await sendEsignEmail(job.data);
  }
}
