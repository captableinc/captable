-- CreateEnum
CREATE TYPE "SecuritiesStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SIGNED', 'PENDING');

-- CreateEnum
CREATE TYPE "VestingScheduleEnum" AS ENUM ('VESTING_0_0_0', 'VESTING_0_0_1', 'VESTING_4_1_0', 'VESTING_4_1_1', 'VESTING_4_3_1', 'VESTING_4_6_1', 'VESTING_4_12_1');

-- CreateEnum
CREATE TYPE "ShareLegendsEnum" AS ENUM ('US_SECURITIES_ACT', 'SALE_AND_ROFR', 'TRANSFER_RESTRICTIONS');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "shareId" TEXT;

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "status" "SecuritiesStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "certificateId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerShare" DOUBLE PRECISION,
    "capitalContribution" DOUBLE PRECISION,
    "ipContribution" DOUBLE PRECISION,
    "debtCancelled" DOUBLE PRECISION,
    "otherContributions" DOUBLE PRECISION,
    "vestingSchedule" "VestingScheduleEnum" NOT NULL,
    "companyLegends" "ShareLegendsEnum"[],
    "issueDate" TIMESTAMP(3) NOT NULL,
    "rule144Date" TIMESTAMP(3),
    "vestingStartDate" TIMESTAMP(3),
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Share_companyId_idx" ON "Share"("companyId");

-- CreateIndex
CREATE INDEX "Share_shareClassId_idx" ON "Share"("shareClassId");

-- CreateIndex
CREATE INDEX "Share_stakeholderId_idx" ON "Share"("stakeholderId");

-- CreateIndex
CREATE INDEX "Document_shareId_idx" ON "Document"("shareId");
