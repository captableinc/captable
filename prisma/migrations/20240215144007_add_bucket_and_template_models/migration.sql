/*
  Warnings:

  - You are about to drop the column `key` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `uploadProvider` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `DocumentFields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentRecepients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bucketId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldTypes" AS ENUM ('text', 'textArea', 'radio', 'checkBox', 'signature', 'date', 'dateTime', 'email');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('draft', 'completed');

-- CreateEnum
CREATE TYPE "EsignRecipientStatus" AS ENUM ('notSigned', 'signed');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "key",
DROP COLUMN "mimeType",
DROP COLUMN "size",
DROP COLUMN "status",
DROP COLUMN "type",
DROP COLUMN "uploadProvider",
ADD COLUMN     "bucketId" TEXT NOT NULL;

-- DropTable
DROP TABLE "DocumentFields";

-- DropTable
DROP TABLE "DocumentRecepients";

-- DropEnum
DROP TYPE "DocumentFieldTypes";

-- DropEnum
DROP TYPE "DocumentSigningStatus";

-- DropEnum
DROP TYPE "DocumentStatus";

-- DropEnum
DROP TYPE "DocumentType";

-- DropEnum
DROP TYPE "UploadProviders";

-- CreateTable
CREATE TABLE "Bucket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldTypes" NOT NULL DEFAULT 'text',
    "placeholder" TEXT NOT NULL DEFAULT '',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "positionX" DECIMAL(65,30) NOT NULL,
    "positionY" DECIMAL(65,30) NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TemplateStatus" NOT NULL DEFAULT 'draft',
    "bucketId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EsignRecipient" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "status" "EsignRecipientStatus" NOT NULL,
    "membershipId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EsignRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateField_templateId_idx" ON "TemplateField"("templateId");

-- CreateIndex
CREATE INDEX "Template_bucketId_idx" ON "Template"("bucketId");

-- CreateIndex
CREATE INDEX "Template_uploaderId_idx" ON "Template"("uploaderId");

-- CreateIndex
CREATE INDEX "Template_companyId_idx" ON "Template"("companyId");

-- CreateIndex
CREATE INDEX "EsignRecipient_membershipId_idx" ON "EsignRecipient"("membershipId");

-- CreateIndex
CREATE INDEX "Document_bucketId_idx" ON "Document"("bucketId");
