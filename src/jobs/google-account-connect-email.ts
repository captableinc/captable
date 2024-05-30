import GoogleAccountConnectEmail from "@/emails/GoogleAccountConnectEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type GoogleAccountConnectPayloadType = {
  email: string;
  username: string;
  companyName: string;
};

export const sendGoogleAccountConnectEmail = async (
  payload: GoogleAccountConnectPayloadType,
) => {
  const { email, username, companyName } = payload;

  const html = await render(
    GoogleAccountConnectEmail({
      email,
      recipientName: username,
      companyName,
    }),
  );

  await sendMail({
    to: email,
    subject: "Google linked to your account",
    html,
  });
};

export class GoogleAccountConnectEmailJob extends BaseJob<GoogleAccountConnectPayloadType> {
  readonly type = "email.google-connected";

  async work(job: Job<GoogleAccountConnectPayloadType>): Promise<void> {
    await sendGoogleAccountConnectEmail(job.data);
  }
}
