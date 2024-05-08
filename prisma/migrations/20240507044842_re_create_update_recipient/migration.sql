/*
  Warnings:

  - You are about to drop the column `sentAt` on the `Update` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `UpdateRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `UpdateRecipient` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UpdateRecipient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[updateId,email]` on the table `UpdateRecipient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `UpdateRecipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Update" DROP COLUMN "sentAt";

-- AlterTable
ALTER TABLE "UpdateRecipient" DROP COLUMN "readAt",
DROP COLUMN "sentAt",
DROP COLUMN "status",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "memberId" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "stakeholderId" DROP NOT NULL;

-- DropEnum
DROP TYPE "UpdateEmailStatusEnum";

-- CreateIndex
CREATE INDEX "UpdateRecipient_id_updateId_idx" ON "UpdateRecipient"("id", "updateId");

-- CreateIndex
CREATE INDEX "UpdateRecipient_memberId_idx" ON "UpdateRecipient"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "UpdateRecipient_updateId_email_key" ON "UpdateRecipient"("updateId", "email");
