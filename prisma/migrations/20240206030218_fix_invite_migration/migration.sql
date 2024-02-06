/*
  Warnings:

  - You are about to drop the column `invitedEmail` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId,userId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Membership` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Membership_companyId_invitedEmail_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "invitedEmail",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_companyId_userId_key" ON "Membership"("companyId", "userId");
