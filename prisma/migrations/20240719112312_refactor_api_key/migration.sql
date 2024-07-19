/*
  Warnings:

  - You are about to drop the column `hashedToken` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `keyId` on the `ApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedKey]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedKey` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partialKey` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApiKey_hashedToken_key";

-- DropIndex
DROP INDEX "ApiKey_keyId_active_idx";

-- DropIndex
DROP INDEX "ApiKey_keyId_key";

-- DropIndex
DROP INDEX "ApiKey_membershipId_active_idx";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "hashedToken",
DROP COLUMN "keyId",
ADD COLUMN     "hashedKey" TEXT NOT NULL,
ADD COLUMN     "partialKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON "ApiKey"("hashedKey");
