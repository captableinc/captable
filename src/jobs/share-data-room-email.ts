import ShareDataRoomEmail from "@/emails/ShareDataRoomEmail";
import { BaseJob } from "@/jobs/base";
import { sendMail } from "@/server/mailer";
import { renderAsync } from "@react-email/components";
import type { Job } from "pg-boss";

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
    html: await renderAsync(
      ShareDataRoomEmail({
        senderName: senderName,
        recipientName,
        companyName,
        dataRoom,
        link,
      }),
    ),

    headers: {
      "X-From-Name": senderName,
    },
  });
};

export class ShareDataRoomEmailJob extends BaseJob<DataRoomEmailPayloadType> {
  readonly type = "email.share-data-room";

  async work(job: Job<DataRoomEmailPayloadType>): Promise<void> {
    await sendShareDataRoomEmail(job.data);
  }
}
