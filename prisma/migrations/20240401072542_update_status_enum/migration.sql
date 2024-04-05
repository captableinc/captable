/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Update` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UpdateStatusEnum" AS ENUM ('DRAFT', 'PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Update" DROP COLUMN "isPublic",
ADD COLUMN     "status" "UpdateStatusEnum" NOT NULL DEFAULT 'DRAFT';
