import { authVerificationEmailWorker } from "./auth-verification-email";
import { eSignNotificationWorker } from "./esign-email";
import { sendMemberInviteEmailWorker } from "./member-inivite-email";
import { passwordResetEmailWorker } from "./password-reset-email";
import { queueManager } from "./queue";
import { shareDataRoomEmailWorker } from "./share-data-room-email";
import { shareUpdateEmailWorker } from "./share-update-email";

export function registerJobs() {
  queueManager.register(shareDataRoomEmailWorker);
  queueManager.register(shareUpdateEmailWorker);
  queueManager.register(passwordResetEmailWorker);
  queueManager.register(sendMemberInviteEmailWorker);
  queueManager.register(eSignNotificationWorker);
  queueManager.register(authVerificationEmailWorker);
}
