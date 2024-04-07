/*
  Warnings:

  - Added the required column `publicId` to the `DocumentShare` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentShare" ADD COLUMN     "publicId" TEXT NOT NULL;
