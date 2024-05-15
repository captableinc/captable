import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { BaseJob } from "@/lib/pg-boss-base";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

export interface TEmailPayload {
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
}

interface TCorePayload {
  email: string;
  token: string;
}

export type TEsignEmailJob = TEmailPayload & TCorePayload;

export const sendEsignEmail = async (payload: TEsignEmailJob) => {
  const { email, token, ...rest } = payload;
  const baseUrl = env.BASE_URL;
  const html = await render(
    EsignEmail({
      signingLink: `${baseUrl}/esign/${token}`,
      ...rest,
    }),
  );
  await sendMail({
    to: email,
    subject: "esign Link",
    html,
  });
};

export class EsignNotificationEmailJob extends BaseJob<TEsignEmailJob> {
  readonly type = "email.esign";

  async work(job: Job<TEsignEmailJob>): Promise<void> {
    await db.esignRecipient.update({
      where: {
        id: job.data.recipient.id,
      },
      data: {
        status: "SENT",
      },
    });

    await sendEsignEmail(job.data);
  }
}
