/*
  Warnings:

  - You are about to alter the column `quantity` on the `Share` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "OptionTypeEnum" AS ENUM ('STOCK_OPTION', 'WARRANT');

-- CreateEnum
CREATE TYPE "OptionStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'EXERCISED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "optionId" TEXT;

-- AlterTable
ALTER TABLE "Share" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "quantity" INTEGER NOT NULL,
    "exercisePrice" DOUBLE PRECISION NOT NULL,
    "type" "OptionTypeEnum" NOT NULL,
    "status" "OptionStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "vestingSchedule" "VestingScheduleEnum" NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "vestingStartDate" TIMESTAMP(3) NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "rule144Date" TIMESTAMP(3) NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "equityPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Option_companyId_idx" ON "Option"("companyId");

-- CreateIndex
CREATE INDEX "Option_equityPlanId_idx" ON "Option"("equityPlanId");

-- CreateIndex
CREATE INDEX "Option_stakeholderId_idx" ON "Option"("stakeholderId");

-- CreateIndex
CREATE INDEX "Document_optionId_idx" ON "Document"("optionId");
