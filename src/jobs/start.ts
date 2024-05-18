import { AuthVerificationEmailJob } from "@/jobs/auth-verification-email";
import { JobManager, boss } from "@/jobs/base";
import { EsignConfirmationEmailJob } from "@/jobs/esign-confirmation-email";
import { EsignNotificationEmailJob } from "@/jobs/esign-email";
import { EsignPdfJob } from "@/jobs/esign-pdf";
import { SendMemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { PasswordResetEmailJob } from "@/jobs/password-reset-email";
import { ShareDataRoomEmailJob } from "@/jobs/share-data-room-email";
import { ShareUpdateEmailJob } from "@/jobs/share-update-email";

export async function startJobs() {
  const jobs = new JobManager(boss)
    .register(AuthVerificationEmailJob)
    .register(ShareUpdateEmailJob)
    .register(ShareDataRoomEmailJob)
    .register(SendMemberInviteEmailJob)
    .register(PasswordResetEmailJob)
    .register(EsignNotificationEmailJob)
    .register(EsignConfirmationEmailJob)
    .register(EsignPdfJob);

  await jobs.start();
}
