import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { BaseJob } from "@/jobs/base";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export interface EsignEmailPayloadType {
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

interface AdditionalPayloadType {
  email: string;
  token: string;
}

export type ExtendedEsignPayloadType = EsignEmailPayloadType &
  AdditionalPayloadType;

export const sendEsignEmail = async (payload: ExtendedEsignPayloadType) => {
  const { email, token, sender, ...rest } = payload;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const html = await render(
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
};

export class EsignNotificationEmailJob extends BaseJob<ExtendedEsignPayloadType> {
  readonly type = "email.esign-notification";

  async work(job: Job<ExtendedEsignPayloadType>): Promise<void> {
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

    await sendEsignEmail(job.data);
  }
}
