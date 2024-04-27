/*
  Warnings:

  - You are about to drop the column `sentAt` on the `Update` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `EsignRecipient` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `EsignRecipient` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `recipientId` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "uploaderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EsignRecipient" ADD COLUMN     "name" TEXT,
ADD COLUMN     "templateId" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "completedOn" TIMESTAMP(3),
ADD COLUMN     "orderedDelivery" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TemplateField" ADD COLUMN     "prefilledValue" TEXT,
ADD COLUMN     "recipientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Update" DROP COLUMN "sentAt",
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "EsignRecipient_templateId_idx" ON "EsignRecipient"("templateId");

-- CreateIndex
CREATE INDEX "TemplateField_recipientId_idx" ON "TemplateField"("recipientId");
