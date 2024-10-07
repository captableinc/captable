/*
  Warnings:

  - Added the required column `bankAccountId` to the `Safe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Safe" ADD COLUMN     "bankAccountId" TEXT NOT NULL,
ALTER COLUMN "publicId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Safe_bankAccountId_idx" ON "Safe"("bankAccountId");
