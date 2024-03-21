/*
  Warnings:

  - You are about to drop the `Updates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Updates";

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "html" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Update_publicId_idx" ON "Update"("publicId");

-- CreateIndex
CREATE INDEX "Update_authorId_idx" ON "Update"("authorId");

-- CreateIndex
CREATE INDEX "Update_companyId_idx" ON "Update"("companyId");
