import GoogleAccountDisconnectEmail from "@/emails/GoogleAccountDisconnectEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type GoogleAccountDisconnectPayloadType = {
  email: string;
  username: string;
  companyName: string;
};

export const sendGoogleAccountDisconnectEmail = async (
  payload: GoogleAccountDisconnectPayloadType,
) => {
  const { email, username, companyName } = payload;

  const html = await render(
    GoogleAccountDisconnectEmail({
      email,
      recipientName: username,
      companyName,
    }),
  );

  await sendMail({
    to: email,
    subject: "Google unlinked from your account",
    html,
  });
};

export class GoogleAccountDisconnectEmailJob extends BaseJob<GoogleAccountDisconnectPayloadType> {
  readonly type = "email.google-disconnected";

  async work(job: Job<GoogleAccountDisconnectPayloadType>): Promise<void> {
    await sendGoogleAccountDisconnectEmail(job.data);
  }
}
