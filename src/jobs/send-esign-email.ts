import { generatePublicId } from "@/common/id";
import { EsignEmail, type EsignEmailProps } from "@/emails/EsignEmail";
import { env } from "@/env";
import { decode, encode } from "@/lib/jwt";
import { EsignRecipientStatus } from "@/prisma/enums";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { invokeTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";
import { z } from "zod";

interface SendEmailOptions {
  email: string;
  token: string;
}
const emailTokenPayloadSchema = z.object({
  id: z.string(),
  rec: z.string(),
});
type TEmailTokenPayloadSchema = z.infer<typeof emailTokenPayloadSchema>;
interface EncodeEmailTokenOption {
  templateId: string;
  recipientId: string;
}

export function EncodeEmailToken({
  recipientId,
  templateId,
}: EncodeEmailTokenOption) {
  const encodeToken: TEmailTokenPayloadSchema = {
    rec: recipientId,
    id: templateId,
  };

  return encode(encodeToken);
}

export async function DecodeEmailToken(jwt: string) {
  const { payload } = await decode(jwt);
  return emailTokenPayloadSchema.parse(payload);
}

// Since other parts were using it, just kept so that build does not break.
export async function SendEsignEmail({ email, token }: SendEmailOptions) {
  const baseUrl = env.BASE_URL;
  const html = await render(
    EsignEmail({
      signingLink: `${baseUrl}/esign/${token}`,
    }),
  );
  await sendMail({
    to: email,
    subject: "esign Link",
    html,
  });
}

const generateSigningLink = (baseUrl: string, token: string): string =>
  `${baseUrl}/esign/${token}`;

interface EsignEmaiJobPayload extends EsignEmailProps {
  templateId: string;
  orderedDelivery: Date | null;
  recipients: {
    id: string;
    name: string;
    email: string;
  }[];
}
export const sendEsignEmailJob = client.defineJob({
  id: "esign-notification-email",
  name: "E-sign notification email",
  version: "0.0.1",
  trigger: invokeTrigger(),
  run: async (payload: EsignEmaiJobPayload, io) => {
    const baseUrl = env.NEXTAUTH_URL;
    const {
      message,
      orderedDelivery,
      templateId,
      recipients,
      documentName,
      sender,
      company,
    } = payload;
    //@TODO ( Execute parallel tasks (not supported yet))
    let shouldBreak = false;
    for (const recipient of recipients) {
      await io.runTask(`recipient-${recipient.id}`, async () => {
        const token = await EncodeEmailToken({
          recipientId: recipient.id,
          templateId,
        });
        const signingLink = generateSigningLink(baseUrl, token);
        const html = await render(
          EsignEmail({
            signingLink,
            message,
            documentName,
            recipient,
            sender,
            company,
          }),
        );
        await sendMail({
          to: recipient.email,
          subject: `Sign a ${documentName?.toLocaleLowerCase()}`,
          html,
        });
        if (orderedDelivery) {
          shouldBreak = true;
        }
      });
      if (shouldBreak) {
        break;
      }
    }
    // Update status to "SENT" (bulk-update)
    await io.runTask(
      `esignRecipient-status-update-${generatePublicId()}`,
      async () => {
        const recipientIds = recipients.map((recipient) => recipient.id);
        if (shouldBreak) {
          return await db.esignRecipient.update({
            where: {
              id: recipients[0]?.id,
            },
            data: {
              status: EsignRecipientStatus.SENT,
            },
          });
        } else {
          return await db.esignRecipient.updateMany({
            where: {
              id: { in: recipientIds },
            },
            data: {
              status: EsignRecipientStatus.SENT,
            },
          });
        }
      },
    );
  },
});
