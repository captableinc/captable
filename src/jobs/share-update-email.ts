import ShareUpdateEmail from "@/emails/ShareUpdateEmail";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import type { Job } from "pg-boss";

export type UpdateSharePayloadType = {
  update: {
    title: string;
  };
  link: string;
  companyName: string;
  senderName: string;
  email: string;
  recipientName?: string | null | undefined;
  senderEmail?: string | null | undefined;
};

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
};

export class ShareUpdateEmailJob extends BaseJob<UpdateSharePayloadType> {
  readonly type = "email.share-update";

  async work(job: Job<UpdateSharePayloadType>): Promise<void> {
    await sendShareUpdateEmail(job.data);
  }
}
