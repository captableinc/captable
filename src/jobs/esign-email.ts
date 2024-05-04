import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { EsignRecipientStatus } from "@/prisma/enums";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";

export interface TEmailPayload {
  documentName?: string;
  message?: string;
  recipient?: {
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

client.defineJob({
  id: "esign-notification-email",
  name: "E-sign notification email",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "email.esign",
  }),

  run: async (payload: TEsignEmailJob, io) => {
    await io.runTask(`send esign email`, async () => {
      await sendEsignEmail(payload);
      if (payload?.recipient?.id) {
        await db.esignRecipient.update({
          where: {
            id: payload.recipient.id,
          },
          data: {
            status: EsignRecipientStatus.SENT,
          },
        });
      }
    });
  },
});
