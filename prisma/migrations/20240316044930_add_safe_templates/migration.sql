/*
  Warnings:

  - The values [UNCAPPED] on the enum `SafeTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `mfn` on table `Safe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `proRata` on table `Safe` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "YCSafeEnum" AS ENUM ('Valuation Cap, no Discount', 'Discount, no Valuation Cap', 'MFN, no Valuation Cap, no Discount', 'Valuation Cap, no Discount, include Pro Rata Rights', 'Discount, no Valuation Cap, include Pro Rata Rights', 'MFN, no Valuation Cap, no Discount, include Pro Rata Rights');

-- AlterEnum
BEGIN;
CREATE TYPE "SafeTypeEnum_new" AS ENUM ('PRE_MONEY', 'POST_MONEY');
ALTER TABLE "Safe" ALTER COLUMN "type" TYPE "SafeTypeEnum_new" USING ("type"::text::"SafeTypeEnum_new");
ALTER TYPE "SafeTypeEnum" RENAME TO "SafeTypeEnum_old";
ALTER TYPE "SafeTypeEnum_new" RENAME TO "SafeTypeEnum";
DROP TYPE "SafeTypeEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "Safe" ADD COLUMN     "ycTemplate" "YCSafeEnum",
ALTER COLUMN "mfn" SET NOT NULL,
ALTER COLUMN "mfn" SET DEFAULT false,
ALTER COLUMN "proRata" SET NOT NULL,
ALTER COLUMN "proRata" SET DEFAULT false;
