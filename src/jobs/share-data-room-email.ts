import ShareDataRoomEmail from "@/emails/ShareDataRoomEmail";
import { BaseJob } from "@/lib/pg-boss-base";
import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import { Job } from "pg-boss";

export type DataRoomEmailPayloadType = {
  link: string;
  dataRoom: string;
  email: string;
  senderName: string;
  companyName: string;
  recipientName?: string | null | undefined;
  senderEmail?: string | null | undefined;
};

export const sendShareDataRoomEmail = async (
  payload: DataRoomEmailPayloadType,
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
      ShareDataRoomEmail({
        senderName: senderName,
        recipientName,
        companyName,
        dataRoom,
        link,
      }),
    ),
  });
};

export class ShareDataRoomEmailJob extends BaseJob<DataRoomEmailPayloadType> {
  readonly type = "email.share-data-room";

  async work(job: Job<DataRoomEmailPayloadType>): Promise<void> {
    sendShareDataRoomEmail(job.data);
  }
}
