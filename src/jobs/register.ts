import { authVerificationEmailWorker } from "./auth-verification-email";
import { eSignConfirmationEmailWorker } from "./esign-confirmation-email";
import { eSignNotificationEmailWorker } from "./esign-email";
import { eSignPdfWorker } from "./esign-pdf";
import { sendMemberInviteEmailWorker } from "./member-inivite-email";
import { passwordResetEmailWorker } from "./password-reset-email";
import { queueManager } from "./queue";
import { shareDataRoomEmailWorker } from "./share-data-room-email";
import { shareUpdateEmailWorker } from "./share-update-email";

export async function registerJobs() {
  queueManager.register(shareDataRoomEmailWorker);
  queueManager.register(shareUpdateEmailWorker);
  queueManager.register(passwordResetEmailWorker);
  queueManager.register(sendMemberInviteEmailWorker);
  queueManager.register(eSignNotificationEmailWorker);
  queueManager.register(authVerificationEmailWorker);
  queueManager.register(eSignConfirmationEmailWorker);
  queueManager.register(eSignPdfWorker);

  //start
  await queueManager.start();
}
