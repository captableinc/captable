/*
  Warnings:

  - Added the required column `verificationTokenToken` to the `EsignRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EsignRecipient" ADD COLUMN     "verificationTokenToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TemplateField" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "EsignRecipient_verificationTokenToken_idx" ON "EsignRecipient"("verificationTokenToken");
