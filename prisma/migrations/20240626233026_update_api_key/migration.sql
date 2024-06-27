/*
  Warnings:

  - You are about to drop the column `secret` on the `ApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedToken]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedToken` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApiKey_secret_key";

-- DropIndex
DROP INDEX "ApiKey_userId_key";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "secret",
ADD COLUMN     "hashedToken" TEXT NOT NULL,
ADD COLUMN     "lastUsed" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedToken_key" ON "ApiKey"("hashedToken");
