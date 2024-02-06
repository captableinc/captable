/*
  Warnings:

  - You are about to drop the column `convertsToFutureRound` on the `ShareClass` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ConversionRightsEnum" AS ENUM ('convertsToFutureRound', 'convertsToShareClassId');

-- AlterTable
ALTER TABLE "ShareClass" DROP COLUMN "convertsToFutureRound",
ADD COLUMN     "conversionRights" "ConversionRightsEnum" NOT NULL DEFAULT 'convertsToFutureRound';
