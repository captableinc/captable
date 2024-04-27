/*
  Warnings:

  - You are about to drop the column `group` on the `TemplateField` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "group",
ADD COLUMN     "recipientId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TemplateField_recipientId_idx" ON "TemplateField"("recipientId");
