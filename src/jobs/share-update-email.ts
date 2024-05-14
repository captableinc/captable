import ShareUpdateEmail from "@/emails/ShareUpdateEmail";
import { BaseJob } from "@/lib/pg-boss-base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

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

export class ShareUpdateEmailJob extends BaseJob<UpdateSharePayloadType> {
  readonly type = "email.share-update";

  async work(job: Job<UpdateSharePayloadType>): Promise<void> {
    await sendShareUpdateEmail(job.data);
  }
}
