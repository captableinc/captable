/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `DataRoomRecipient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dataRoomId,email]` on the table `DataRoomRecipient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `DataRoomRecipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataRoomRecipient" DROP COLUMN "expiresAt",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DataRoomRecipient_dataRoomId_email_key" ON "DataRoomRecipient"("dataRoomId", "email");
