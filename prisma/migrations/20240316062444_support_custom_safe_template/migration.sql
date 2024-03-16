/*
  Warnings:

  - You are about to drop the column `ycTemplate` on the `Safe` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SafeTemplateEnum" AS ENUM ('Valuation Cap, no Discount', 'Discount, no Valuation Cap', 'MFN, no Valuation Cap, no Discount', 'Valuation Cap, no Discount, include Pro Rata Rights', 'Discount, no Valuation Cap, include Pro Rata Rights', 'MFN, no Valuation Cap, no Discount, include Pro Rata Rights', 'Custom');

-- AlterTable
ALTER TABLE "Safe" DROP COLUMN "ycTemplate",
ADD COLUMN     "safeTemplate" "SafeTemplateEnum";

-- DropEnum
DROP TYPE "YCSafeEnum";
