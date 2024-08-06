import TwoFADisabledEmail from "@/emails/2FADisabledEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type TwoFADisabledPayloadType = {
  email: string;
  companyName: string;
  userName: string;
};

export const Send2FADisabledEmail = async (
  payload: TwoFADisabledPayloadType,
) => {
  const { email, companyName, userName } = payload;

  const html = await render(
    TwoFADisabledEmail({
      companyName,
      userName,
    }),
  );

  await sendMail({
    to: email,
    subject: "Two factor authentication disabled",
    html,
  });
};

export class TwoFADisabledEmailJob extends BaseJob<TwoFADisabledPayloadType> {
  readonly type = "email.2fa-disabled";

  async work(job: Job<TwoFADisabledPayloadType>): Promise<void> {
    await Send2FADisabledEmail(job.data);
  }
}
