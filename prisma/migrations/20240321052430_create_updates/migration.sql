-- CreateEnum
CREATE TYPE "UpdateEmailStatusEnum" AS ENUM ('SENT', 'PENDING', 'FAILED');

-- CreateTable
CREATE TABLE "Updates" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateRecipient" (
    "id" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,
    "status" "UpdateEmailStatusEnum" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Updates_publicId_idx" ON "Updates"("publicId");

-- CreateIndex
CREATE INDEX "Updates_authorId_idx" ON "Updates"("authorId");

-- CreateIndex
CREATE INDEX "Updates_companyId_idx" ON "Updates"("companyId");

-- CreateIndex
CREATE INDEX "UpdateRecipient_updateId_idx" ON "UpdateRecipient"("updateId");

-- CreateIndex
CREATE INDEX "UpdateRecipient_stakeholderId_idx" ON "UpdateRecipient"("stakeholderId");
