import TwoFAEnabledEmail from "@/emails/2FAEnabledEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type TwoFAEnabledPayloadType = {
  email: string;
  userName: string;
  companyName: string;
};

export const Send2FAEnabledEmail = async (payload: TwoFAEnabledPayloadType) => {
  const { email, userName, companyName } = payload;

  const html = await render(
    TwoFAEnabledEmail({
      userName,
      companyName,
    }),
  );

  await sendMail({
    to: email,
    subject: "Two factor authentication enabled",
    html,
  });
};

export class TwoFAEnabledEmailJob extends BaseJob<TwoFAEnabledPayloadType> {
  readonly type = "email.2fa-enabled";

  async work(job: Job<TwoFAEnabledPayloadType>): Promise<void> {
    await Send2FAEnabledEmail(job.data);
  }
}
