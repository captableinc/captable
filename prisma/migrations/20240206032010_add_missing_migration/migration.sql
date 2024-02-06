/*
  Warnings:

  - You are about to drop the column `conversionRights` on the `ShareClass` table. All the data in the column will be lost.
  - Added the required column `convertsToFutureRound` to the `ShareClass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convertsToShareClassId` to the `ShareClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShareClass" DROP COLUMN "conversionRights",
ADD COLUMN     "convertsToFutureRound" BOOLEAN NOT NULL,
ADD COLUMN     "convertsToShareClassId" TEXT NOT NULL;
