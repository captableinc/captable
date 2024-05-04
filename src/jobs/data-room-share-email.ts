import DataRoomShareEmail from "@/emails/DataRoomShareEMail";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";
import { z } from "zod";

const schema = z.object({
  dataRoom: z.string(),
  link: z.string(),
  companyName: z.string(),
  recipientName: z.string().nullish(),
  senderName: z.string(),
  senderEmail: z.string().nullish(),
  email: z.string(),
});

export type TDataRoomSharePayloadSchema = z.infer<typeof schema>;

export const sendDataRoomShareEmail = async (
  payload: TDataRoomSharePayloadSchema,
) => {
  const {
    dataRoom,
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
    subject: `${senderName} shared a data room - ${dataRoom}`,
    html: await render(
      DataRoomShareEmail({
        senderName: senderName,
        recipientName,
        companyName,
        dataRoom,
        link,
      }),
    ),
  });
};

export const triggerName = "email.data-room-share";

client.defineJob({
  id: "data-room-share-email",
  name: "data room share email",
  version: "0.0.1",
  trigger: eventTrigger({
    name: triggerName,
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask("send data room share email", async () => {
      await sendDataRoomShareEmail(payload);
    });
  },
});
