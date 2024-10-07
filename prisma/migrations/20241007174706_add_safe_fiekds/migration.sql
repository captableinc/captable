/*
  Warnings:

  - You are about to drop the column `stakeholderId` on the `Safe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[signerMemberId]` on the table `Safe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[signerStakeholderId]` on the table `Safe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signerMemberId` to the `Safe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signerStakeholderId` to the `Safe` table without a default value. This is not possible if the table is not empty.
  - Made the column `publicId` on table `Safe` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SafeSigningStatus" AS ENUM ('SIGNED', 'PENDING');

-- DropIndex
DROP INDEX "Safe_stakeholderId_idx";

-- AlterTable
ALTER TABLE "Safe" DROP COLUMN "stakeholderId",
ADD COLUMN     "signerMemberId" TEXT NOT NULL,
ADD COLUMN     "signerStakeholderId" TEXT NOT NULL,
ALTER COLUMN "publicId" SET NOT NULL;

-- CreateTable
CREATE TABLE "SafeSignerMember" (
    "id" TEXT NOT NULL,
    "status" "SafeSigningStatus" NOT NULL DEFAULT 'PENDING',
    "memberId" TEXT NOT NULL,

    CONSTRAINT "SafeSignerMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafeSignerStakeholder" (
    "id" TEXT NOT NULL,
    "status" "SafeSigningStatus" NOT NULL DEFAULT 'PENDING',
    "stakeholderId" TEXT NOT NULL,

    CONSTRAINT "SafeSignerStakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafeSigningToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "signerMemberId" TEXT,
    "signerStakeholderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeSigningToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldTypes" NOT NULL DEFAULT 'TEXT',
    "defaultValue" TEXT NOT NULL DEFAULT '',
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "prefilledValue" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "safeSignerStakeholderId" TEXT,
    "safeSignerMemberId" TEXT,

    CONSTRAINT "DocumentCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SafeSignerMember_memberId_idx" ON "SafeSignerMember"("memberId");

-- CreateIndex
CREATE INDEX "SafeSignerStakeholder_stakeholderId_idx" ON "SafeSignerStakeholder"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "SafeSigningToken_token_key" ON "SafeSigningToken"("token");

-- CreateIndex
CREATE INDEX "SafeSigningToken_signerStakeholderId_idx" ON "SafeSigningToken"("signerStakeholderId");

-- CreateIndex
CREATE INDEX "SafeSigningToken_signerMemberId_idx" ON "SafeSigningToken"("signerMemberId");

-- CreateIndex
CREATE INDEX "DocumentCustomField_safeSignerStakeholderId_idx" ON "DocumentCustomField"("safeSignerStakeholderId");

-- CreateIndex
CREATE INDEX "DocumentCustomField_safeSignerMemberId_idx" ON "DocumentCustomField"("safeSignerMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "Safe_signerMemberId_key" ON "Safe"("signerMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "Safe_signerStakeholderId_key" ON "Safe"("signerStakeholderId");

-- CreateIndex
CREATE INDEX "Safe_signerMemberId_idx" ON "Safe"("signerMemberId");

-- CreateIndex
CREATE INDEX "Safe_signerStakeholderId_idx" ON "Safe"("signerStakeholderId");
