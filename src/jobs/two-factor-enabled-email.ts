import TwoFAEnabledEmail from "@/emails/2FARecoveryCodesEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type TwoFAEnabledPayloadType = {
  email: string;
  recoveryCodes: string[];
};

export const Send2FAEnabledEmail = async (payload: TwoFAEnabledPayloadType) => {
  const { email, recoveryCodes } = payload;

  const html = await render(
    TwoFAEnabledEmail({
      recoveryCodes,
    }),
  );

  await sendMail({
    to: email,
    subject: "2FA recovery codes",
    html,
  });
};

export class TwoFAEnabledEmailJob extends BaseJob<TwoFAEnabledPayloadType> {
  readonly type = "email.2fa-enabled";

  async work(job: Job<TwoFAEnabledPayloadType>): Promise<void> {
    await Send2FAEnabledEmail(job.data);
  }
}
