import UpdateShareEmail from "@/emails/UpdateShareEmail";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";
import { z } from "zod";

const schema = z.object({
  update: z.object({
    name: z.string(),
  }),
  link: z.string(),
  companyName: z.string(),
  recipientName: z.string().nullish(),
  senderName: z.string(),
  senderEmail: z.string().nullish(),
  email: z.string(),
});

export type UpdateSharePayloadType = z.infer<typeof schema>;

export const sendUpdateShareEmail = async (payload: UpdateSharePayloadType) => {
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
    subject: `${senderName} shared an update - ${update.name}`,
    html: await render(
      UpdateShareEmail({
        senderName: senderName,
        recipientName,
        companyName,
        updateTitle: update.name,
        link,
      }),
    ),
  });
};

export const triggerName = "email.update-share";

client.defineJob({
  id: "update-share-email",
  name: "Investor update share email",
  version: "0.0.1",
  trigger: eventTrigger({
    name: triggerName,
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask("Send investor update", async () => {
      await sendUpdateShareEmail(payload);
    });
  },
});
