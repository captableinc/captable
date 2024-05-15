import { AuthVerificationEmailJob } from "@/jobs/auth-verification-email";
import { EsignNotificationEmailJob } from "@/jobs/esign-email";
import { SendMemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { PasswordResetEmailJob } from "@/jobs/password-reset-email";
import { ShareDataRoomEmailJob } from "@/jobs/share-data-room-email";
import { ShareUpdateEmailJob } from "@/jobs/share-update-email";
import { JobManager, boss } from "./pg-boss-base";

export async function initPgBoss() {
  const jobs = new JobManager(boss)
    .register(AuthVerificationEmailJob)
    .register(ShareUpdateEmailJob)
    .register(ShareDataRoomEmailJob)
    .register(SendMemberInviteEmailJob)
    .register(PasswordResetEmailJob)
    .register(EsignNotificationEmailJob);

  await jobs.start();
}
