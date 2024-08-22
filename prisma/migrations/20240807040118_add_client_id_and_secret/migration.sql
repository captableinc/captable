/*
  Warnings:

  - You are about to drop the column `name` on the `AccessToken` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `AccessToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSecret` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessTokenType" AS ENUM ('Signature token', 'Data room token', 'API access token', 'Investor update token');

-- AlterTable
ALTER TABLE "AccessToken" DROP COLUMN "name",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "clientSecret" TEXT NOT NULL,
ADD COLUMN     "typeEnum" "AccessTokenType" NOT NULL DEFAULT 'API access token';

-- CreateIndex
CREATE INDEX "AccessToken_typeEnum_clientId_idx" ON "AccessToken"("typeEnum", "clientId");
