/*
  Warnings:

  - You are about to drop the column `uploadedById` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mimeType` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadProvider` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploaderId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UploadProviders" AS ENUM ('S3', 'R2');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('SAFE', 'EQUITY', 'GENERIC');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DocumentFieldTypes" AS ENUM ('TEXT', 'TEXT_AREA', 'RADIO', 'CHECK_BOX', 'SIGNATURE', 'DATE', 'DATE_TIME', 'EMAIL');

-- CreateEnum
CREATE TYPE "DocumentSigningStatus" AS ENUM ('NOT_SIGNED', 'SIGNED');

-- DropIndex
DROP INDEX "Document_uploadedById_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "uploadedById",
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "uploadProvider" "UploadProviders" NOT NULL,
ADD COLUMN     "uploaderId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL;

-- CreateTable
CREATE TABLE "DocumentFields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentFieldTypes" NOT NULL DEFAULT 'TEXT',
    "placeholder" TEXT NOT NULL DEFAULT '',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRecepients" (
    "id" TEXT NOT NULL,
    "signedStatus" "DocumentSigningStatus" NOT NULL,
    "membershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRecepients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentFields_documentId_idx" ON "DocumentFields"("documentId");

-- CreateIndex
CREATE INDEX "DocumentRecepients_membershipId_idx" ON "DocumentRecepients"("membershipId");

-- CreateIndex
CREATE INDEX "Document_uploaderId_idx" ON "Document"("uploaderId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_publicId_key" ON "Document"("publicId");
