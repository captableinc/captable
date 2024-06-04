-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('one_time', 'recurring');

-- CreateEnum
CREATE TYPE "PricingPlanInterval" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" TEXT,
    "unitAmount" BIGINT,
    "currency" CHAR(3) NOT NULL,
    "type" "PricingType" NOT NULL,
    "interval" "PricingPlanInterval",
    "intervalCount" INTEGER,
    "trialPeriodDays" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "cancelAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "metadata" JSONB,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingCustomer" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "BillingCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Price_productId_idx" ON "Price"("productId");

-- CreateIndex
CREATE INDEX "Subscription_priceId_idx" ON "Subscription"("priceId");

-- CreateIndex
CREATE INDEX "Subscription_customerId_idx" ON "Subscription"("customerId");

-- CreateIndex
CREATE INDEX "BillingCustomer_companyId_idx" ON "BillingCustomer"("companyId");
