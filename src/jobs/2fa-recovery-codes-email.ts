import TwoFARecoveryCodesEmail from "@/emails/2FARecoveryCodesEmail";
import { BaseJob } from "@/jobs/base";

import { sendMail } from "@/server/mailer";
import { render } from "jsx-email";
import type { Job } from "pg-boss";

export type TwoFARecoveryCodesPayloadType = {
  email: string;
  recoveryCodes: string[];
};

export const Send2FARecoveryCodesEmail = async (
  payload: TwoFARecoveryCodesPayloadType,
) => {
  const { email, recoveryCodes } = payload;

  const html = await render(
    TwoFARecoveryCodesEmail({
      recoveryCodes,
    }),
  );

  await sendMail({
    to: email,
    subject: "2FA recovery codes",
    html,
  });
};

export class TwoFARecoveryCodesEmailJob extends BaseJob<TwoFARecoveryCodesPayloadType> {
  readonly type = "email.2fa-recovery-codes";

  async work(job: Job<TwoFARecoveryCodesPayloadType>): Promise<void> {
    await Send2FARecoveryCodesEmail(job.data);
  }
}
