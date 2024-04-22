/*
  Warnings:

  - The `recipients` column on the `DocumentShare` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DocumentShare" DROP COLUMN "recipients",
ADD COLUMN     "recipients" TEXT[] DEFAULT ARRAY[]::TEXT[];
