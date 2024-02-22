/*
  Warnings:

  - You are about to drop the column `type` on the `Stakeholder` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Stakeholder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StakeholderRelationshipEnum" AS ENUM ('ADVISOR', 'BOARD_MEMBER', 'CONSULTANT', 'EMPLOYEE', 'EX_ADVISOR', 'EX_CONSULTANT', 'EX_EMPLOYEE', 'EXECUTIVE', 'FOUNDER', 'INVESTOR', 'NON_US_EMPLOYEE', 'OFFICER', 'OTHER');

-- AlterTable
ALTER TABLE "Stakeholder" DROP COLUMN "type",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "currentRelationship" "StakeholderRelationshipEnum" NOT NULL DEFAULT 'EMPLOYEE',
ADD COLUMN     "institutionName" TEXT,
ADD COLUMN     "stakeholder_type" "StakeholderTypeEnum" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "state" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "zipcode" TEXT;

-- CreateIndex
CREATE INDEX "Stakeholder_companyId_idx" ON "Stakeholder"("companyId");
