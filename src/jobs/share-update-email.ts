import ShareUpdateEmail from "@/emails/ShareUpdateEmail";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "./queue";

const config = defineWorkerConfig({
  name: "email.share-update",
  schema: z.object({
    update: z.object({
      title: z.string(),
    }),
    link: z.string(),
    companyName: z.string(),
    senderName: z.string(),
    email: z.string().email(),
    recipientName: z.string().nullish(),
    senderEmail: z.string().email().nullish(),
  }),
});

export const shareUpdateEmailJob = defineJob(config);

export const shareUpdateEmailWorker = defineWorker(config, async (job) => {
  const {
    update,
    link,
    companyName,
    recipientName,
    senderName,
    email,
    senderEmail,
  } = job.data;
  await sendMail({
    to: email,
    ...(senderEmail && { replyTo: senderEmail }),
    subject: `${senderName} shared an update - ${update.title}`,
    html: await renderAsync(
      ShareUpdateEmail({
        senderName: senderName,
        recipientName,
        companyName,
        updateTitle: update.title,
        link,
      }),
    ),

    headers: {
      "X-From-Name": senderName,
    },
  });
});
