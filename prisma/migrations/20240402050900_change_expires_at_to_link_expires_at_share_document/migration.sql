/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `DocumentShare` table. All the data in the column will be lost.
  - Added the required column `linkExpiresAt` to the `DocumentShare` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentShare" DROP COLUMN "expiresAt",
ADD COLUMN     "linkExpiresAt" TIMESTAMP(3) NOT NULL;
