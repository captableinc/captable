/*
  Warnings:

  - You are about to drop the column `membershipId` on the `EsignRecipient` table. All the data in the column will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- DropIndex
DROP INDEX "EsignRecipient_membershipId_idx";

-- AlterTable
ALTER TABLE "EsignRecipient" DROP COLUMN "membershipId",
ADD COLUMN     "memberId" TEXT;

-- DropTable
DROP TABLE "Membership";

-- DropEnum
DROP TYPE "MembershipStatusEnum";

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "status" "MemberStatusEnum" NOT NULL DEFAULT 'PENDING',
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "workEmail" TEXT,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Member_companyId_idx" ON "Member"("companyId");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_companyId_userId_key" ON "Member"("companyId", "userId");

-- CreateIndex
CREATE INDEX "EsignRecipient_memberId_idx" ON "EsignRecipient"("memberId");
