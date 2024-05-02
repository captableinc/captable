import { generatePublicId } from "@/common/id";
import { EsignEmail, type EsignEmailProps } from "@/emails/EsignEmail";
import { env } from "@/env";
import { EsignRecipientStatus } from "@/prisma/enums";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { invokeTrigger } from "@trigger.dev/sdk";
import { SignJWT, jwtVerify } from "jose";
import { render } from "jsx-email";
import { z } from "zod";

const emailTokenPayloadSchema = z.object({
  id: z.string(),
  rec: z.string(),
});
type TEmailTokenPayloadSchema = z.infer<typeof emailTokenPayloadSchema>;
interface EncodeEmailTokenOption {
  templateId: string;
  recipientId: string;
}
const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);

export async function EncodeEmailToken({
  recipientId,
  templateId,
}: EncodeEmailTokenOption) {
  const encodeToken: TEmailTokenPayloadSchema = {
    rec: recipientId,
    id: templateId,
  };
  return new SignJWT(encodeToken)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
}

export async function DecodeEmailToken(jwt: string) {
  const { payload } = await jwtVerify(jwt, secret);
  return emailTokenPayloadSchema.parse(payload);
}

// Since other parts were using it, just kept so that build does not break.
export async function SendEsignEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const baseUrl = env.NEXTAUTH_URL;
  const html = await render(
    EsignEmail({
      signingLink: `${baseUrl}/documents/esign/${token}`,
    }),
  );
  await sendMail({
    to: email,
    subject: "esign Link",
    html,
  });
}

const generateSigningLink = (baseUrl: string, token: string): string =>
  `${baseUrl}/documents/esign/${token}`;

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
  id: "esign-email",
  name: "E-sign email",
  version: "1.0.1",
  trigger: invokeTrigger(),
  run: async (payload: EsignEmaiJobPayload, io) => {
    const baseUrl = env.NEXTAUTH_URL;
    const {
      optionalMessage,
      orderedDelivery,
      templateId,
      recipients,
      documentName,
      sender,
      company,
      expiryDate,
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
            optionalMessage,
            documentName,
            recipient,
            sender,
            company,
            expiryDate,
          }),
        );
        await sendMail({
          to: recipient.email,
          subject: `Sign a ${documentName}`,
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
