-- CreateEnum
CREATE TYPE "BankAccountTypeEnum" AS ENUM ('CHECKING', 'SAVINGS');

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryAddress" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAddress" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "accountType" "BankAccountTypeEnum" NOT NULL DEFAULT 'CHECKING',
    "swiftCode" TEXT,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankAccount_companyId_idx" ON "BankAccount"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_companyId_accountNumber_key" ON "BankAccount"("companyId", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_companyId_primary_key" ON "BankAccount"("companyId", "primary");
