/*
  Warnings:

  - You are about to drop the column `notes` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Share` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SafeTypeEnum" AS ENUM ('PRE_MONEY', 'POST_MONEY', 'UNCAPPED');

-- CreateEnum
CREATE TYPE "SafeStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConvertibleStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConvertibleTypeEnum" AS ENUM ('CCD', 'OCD', 'NOTE');

-- CreateEnum
CREATE TYPE "ConvertibleInterestMethodEnum" AS ENUM ('SIMPLE', 'COMPOUND');

-- CreateEnum
CREATE TYPE "ConvertibleInterestAccrualEnum" AS ENUM ('DAILY', 'MONTHLY', 'SEMI_ANNUALLY', 'ANNUALLY', 'YEARLY', 'CONTINUOUSLY');

-- CreateEnum
CREATE TYPE "ConvertibleInterestPaymentScheduleEnum" AS ENUM ('DEFERRED', 'PAY_AT_MATURITY');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "convertibleNoteId" TEXT,
ADD COLUMN     "safeId" TEXT;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "notes";

-- CreateTable
CREATE TABLE "Safe" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "SafeTypeEnum" NOT NULL,
    "status" "SafeStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "capital" DOUBLE PRECISION NOT NULL,
    "valuationCap" DOUBLE PRECISION,
    "discountRate" DOUBLE PRECISION,
    "mfn" BOOLEAN,
    "proRata" BOOLEAN,
    "additionalTerms" TEXT,
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Safe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConvertibleNote" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "status" "ConvertibleStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "type" "ConvertibleTypeEnum" NOT NULL DEFAULT 'NOTE',
    "capital" DOUBLE PRECISION NOT NULL,
    "conversionCap" DOUBLE PRECISION,
    "discountRate" DOUBLE PRECISION,
    "mfn" BOOLEAN,
    "additionalTerms" TEXT,
    "interestRate" DOUBLE PRECISION,
    "interestMethod" "ConvertibleInterestMethodEnum",
    "interestAccrual" "ConvertibleInterestAccrualEnum",
    "interestPaymentSchedule" "ConvertibleInterestPaymentScheduleEnum",
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConvertibleNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Safe_companyId_idx" ON "Safe"("companyId");

-- CreateIndex
CREATE INDEX "Safe_stakeholderId_idx" ON "Safe"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "Safe_publicId_companyId_key" ON "Safe"("publicId", "companyId");

-- CreateIndex
CREATE INDEX "ConvertibleNote_companyId_idx" ON "ConvertibleNote"("companyId");

-- CreateIndex
CREATE INDEX "ConvertibleNote_stakeholderId_idx" ON "ConvertibleNote"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "ConvertibleNote_publicId_companyId_key" ON "ConvertibleNote"("publicId", "companyId");

-- CreateIndex
CREATE INDEX "Document_safeId_idx" ON "Document"("safeId");

-- CreateIndex
CREATE INDEX "Document_convertibleNoteId_idx" ON "Document"("convertibleNoteId");
