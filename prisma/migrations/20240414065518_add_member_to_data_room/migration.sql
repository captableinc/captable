-- AlterTable
ALTER TABLE "DataRoomRecipient" ADD COLUMN     "memberId" TEXT;

-- CreateIndex
CREATE INDEX "DataRoomRecipient_memberId_idx" ON "DataRoomRecipient"("memberId");
