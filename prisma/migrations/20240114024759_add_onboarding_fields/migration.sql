/*
  Warnings:

  - Made the column `companyId` on table `Membership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "companyId" SET NOT NULL;
