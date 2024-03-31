/*
  Warnings:

  - You are about to drop the column `sharedAt` on the `Update` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Update" DROP COLUMN "sharedAt",
ADD COLUMN     "sentAt" TIMESTAMP(3);
