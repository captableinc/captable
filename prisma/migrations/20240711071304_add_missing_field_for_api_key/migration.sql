/*
  Warnings:

  - You are about to drop the column `userId` on the `ApiKey` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApiKey_userId_active_idx";

-- DropIndex
DROP INDEX "ApiKey_userId_idx";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "userId",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "membershipId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ApiKey_membershipId_idx" ON "ApiKey"("membershipId");

-- CreateIndex
CREATE INDEX "ApiKey_membershipId_active_idx" ON "ApiKey"("membershipId", "active");

-- CreateIndex
CREATE INDEX "ApiKey_companyId_idx" ON "ApiKey"("companyId");
