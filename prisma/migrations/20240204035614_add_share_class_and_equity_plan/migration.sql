-- CreateEnum
CREATE TYPE "ShareTypeEnum" AS ENUM ('common', 'preferred');

-- CreateEnum
CREATE TYPE "SharePrefixEnum" AS ENUM ('CS', 'PS');

-- CreateEnum
CREATE TYPE "CancellationBehaviorEnum" AS ENUM ('RETIRE', 'RETURN_TO_POOL', 'HOLD_AS_CAPITAL_STOCK', 'DEFINED_PER_PLAN_SECURITY');

-- CreateTable
CREATE TABLE "ShareClass" (
    "id" TEXT NOT NULL,
    "idx" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classType" "ShareTypeEnum" NOT NULL DEFAULT 'common',
    "prefix" "SharePrefixEnum" NOT NULL DEFAULT 'CS',
    "initialSharesAuthorized" BIGINT NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "stockholderApprovalDate" TIMESTAMP(3) NOT NULL,
    "votesPerShare" INTEGER NOT NULL,
    "parValue" DOUBLE PRECISION NOT NULL,
    "pricePerShare" DOUBLE PRECISION NOT NULL,
    "seniority" INTEGER NOT NULL,
    "conversionRights" JSONB NOT NULL DEFAULT '{"convertsToFutureRound": null,"convertsToStockClassId": null}',
    "liquidationPreferenceMultiple" DOUBLE PRECISION NOT NULL,
    "participationCapMultiple" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "initialSharesReserved" BIGINT NOT NULL,
    "defaultCancellatonBehavior" "CancellationBehaviorEnum" NOT NULL,
    "comments" JSONB NOT NULL DEFAULT '[]',
    "companyId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquityPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShareClass_companyId_idx" ON "ShareClass"("companyId");

-- CreateIndex
CREATE INDEX "EquityPlan_shareClassId_idx" ON "EquityPlan"("shareClassId");

-- CreateIndex
CREATE INDEX "EquityPlan_companyId_idx" ON "EquityPlan"("companyId");
