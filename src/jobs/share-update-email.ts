import ShareUpdateEmail from "@/emails/ShareUpdateEmail";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";
import { z } from "zod";

const schema = z.object({
  update: z.object({
    title: z.string(),
  }),
  link: z.string(),
  companyName: z.string(),
  recipientName: z.string().nullish(),
  senderName: z.string(),
  senderEmail: z.string().nullish(),
  email: z.string(),
});

export type UpdateSharePayloadType = z.infer<typeof schema>;

export const sendShareUpdateEmail = async (payload: UpdateSharePayloadType) => {
  const {
    update,
    link,
    companyName,
    recipientName,
    senderName,
    email,
    senderEmail,
  } = payload;
  await sendMail({
    to: email,
    ...(senderEmail && { replyTo: senderEmail }),
    subject: `${senderName} shared an update - ${update.title}`,
    html: await render(
      ShareUpdateEmail({
        senderName: senderName,
        recipientName,
        companyName,
        updateTitle: update.title,
        link,
      }),
    ),
  });
};

export const triggerName = "email.share-update-email";

client.defineJob({
  id: "share-update-email",
  name: "Investor update share email",
  version: "0.0.1",
  trigger: eventTrigger({
    name: triggerName,
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask("Send investor update", async () => {
      await sendShareUpdateEmail(payload);
    });
  },
});
