/*
  Warnings:

  - Added the required column `companyId` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Audit_companyId_idx" ON "Audit"("companyId");
