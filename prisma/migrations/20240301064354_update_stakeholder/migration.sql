/*
  Warnings:

  - You are about to drop the column `stakeholder_type` on the `Stakeholder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Stakeholder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stakeholder" DROP COLUMN "stakeholder_type",
ADD COLUMN     "stakeholderType" "StakeholderTypeEnum" NOT NULL DEFAULT 'INDIVIDUAL';

-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder_email_key" ON "Stakeholder"("email");
