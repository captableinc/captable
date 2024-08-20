/*
  Warnings:

  - The values [Signature token] on the enum `AccessTokenType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccessTokenType_new" AS ENUM ('Data room token', 'API access token', 'Investor update token');
ALTER TABLE "AccessToken" ALTER COLUMN "typeEnum" DROP DEFAULT;
ALTER TABLE "AccessToken" ALTER COLUMN "typeEnum" TYPE "AccessTokenType_new" USING ("typeEnum"::text::"AccessTokenType_new");
ALTER TYPE "AccessTokenType" RENAME TO "AccessTokenType_old";
ALTER TYPE "AccessTokenType_new" RENAME TO "AccessTokenType";
DROP TYPE "AccessTokenType_old";
ALTER TABLE "AccessToken" ALTER COLUMN "typeEnum" SET DEFAULT 'API access token';
COMMIT;

-- CreateTable
CREATE TABLE "ESignToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ESignToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ESignToken_templateId_idx" ON "ESignToken"("templateId");

-- CreateIndex
CREATE INDEX "ESignToken_recipientId_idx" ON "ESignToken"("recipientId");
