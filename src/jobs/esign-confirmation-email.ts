import { ConfirmationEmailBody } from "@/emails/EsignConfirmationEmail";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";

export interface TypeGeneralPayload {
  fileUrl: string;
  documentName: string;
  senderName: string | null;
  company: {
    name: string;
    logo?: string | null;
  };
}

export interface TConfirmationEmailPayload extends TypeGeneralPayload {
  recipient: { name: string | null; email: string };
}

export type TRecipientsKind = TypeGeneralPayload & {
  kind: "RECIPIENTS";
  recipients: { id: string; name: string | null; email: string }[];
};

export type TRecipientKind = TypeGeneralPayload & {
  kind: "RECIPIENT";
  recipient: { id: string; name: string | null; email: string };
};

export type TConfirmationEmailJobPayload = TRecipientKind | TRecipientsKind;

type Payload = TConfirmationEmailPayload;
export const sendEsignConfirmationEmail = async (payload: Payload) => {
  const html = await render(
    ConfirmationEmailBody({
      documentName: payload.documentName,
      recipient: payload.recipient,
      senderName: payload.senderName,
      company: payload.company,
    }),
  );
  await sendMail({
    to: payload.recipient.email,
    subject: "Completed e-signed documents from all partiess",
    html,
    attachments: [
      {
        filename: "signed_document.pdf",
        path: payload.fileUrl,
      },
    ],
  });
};

client.defineJob({
  id: "esign-confirmation-email",
  name: "esign confirmation email",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "esign.send-confirmation",
  }),

  run: async (payload: TConfirmationEmailJobPayload, io) => {
    if (payload.kind === "RECIPIENT") {
      await io.runTask(
        `send-confirmation-email-${payload.recipient.id}`,
        async () => {
          await sendEsignConfirmationEmail({
            documentName: payload.documentName,
            senderName: payload.senderName,
            company: payload.company,
            fileUrl: payload.fileUrl,
            recipient: {
              name: payload.recipient?.name,
              email: payload.recipient.email,
            },
          });
        },
      );
    }

    if (payload.kind === "RECIPIENTS") {
      for (const recipient of payload.recipients) {
        await io.runTask(`recpient-${recipient.id}`, async () => {
          await sendEsignConfirmationEmail({
            documentName: payload.documentName,
            senderName: payload.senderName,
            company: payload.company,
            fileUrl: payload.fileUrl,
            recipient: {
              name: recipient?.name,
              email: recipient.email,
            },
          });
        });
      }
    }
  },
});
