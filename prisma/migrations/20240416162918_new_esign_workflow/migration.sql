/*
  Warnings:

  - You are about to drop the column `sentAt` on the `Update` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Update` table. All the data in the column will be lost.
  - Added the required column `group` to the `EsignRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `EsignRecipient` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `EsignRecipient` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `group` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "uploaderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EsignRecipient" ADD COLUMN     "group" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "templateId" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "orderedDelivery" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TemplateField" ADD COLUMN     "group" TEXT NOT NULL,
ADD COLUMN     "prefilledValue" TEXT;

-- AlterTable
ALTER TABLE "Update" DROP COLUMN "sentAt",
DROP COLUMN "status",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "UpdateStatusEnum";

-- CreateIndex
CREATE INDEX "EsignRecipient_templateId_idx" ON "EsignRecipient"("templateId");
