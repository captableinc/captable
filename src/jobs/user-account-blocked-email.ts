import UserAccountBlockedEmail from "@/emails/UserAccountBlockedEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type UserAccountBlockedPayloadType = {
  email: string;
  userName: string;
  companyName: string;
};

export const SendUserAccountBlockedEmail = async (
  payload: UserAccountBlockedPayloadType,
) => {
  const { email, userName, companyName } = payload;

  const html = await render(
    UserAccountBlockedEmail({
      userName,
      companyName,
    }),
  );

  await sendMail({
    to: email,
    subject: "User account blocked",
    html,
  });
};

export class UserAccountBlockedEmailJob extends BaseJob<UserAccountBlockedPayloadType> {
  readonly type = "email.account-blocked";

  async work(job: Job<UserAccountBlockedPayloadType>): Promise<void> {
    await SendUserAccountBlockedEmail(job.data);
  }
}
