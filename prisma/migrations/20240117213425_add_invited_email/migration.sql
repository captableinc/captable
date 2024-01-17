/*
  Warnings:

  - A unique constraint covering the columns `[companyId,invitedEmail]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Membership_userId_companyId_key";

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "invitedEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_companyId_invitedEmail_key" ON "Membership"("companyId", "invitedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");
