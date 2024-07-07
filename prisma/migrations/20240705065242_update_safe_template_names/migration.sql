/*
  Warnings:

  - The values [Valuation Cap, no Discount,Discount, no Valuation Cap,MFN, no Valuation Cap, no Discount,Valuation Cap, no Discount, include Pro Rata Rights,Discount, no Valuation Cap, include Pro Rata Rights,MFN, no Valuation Cap, no Discount, include Pro Rata Rights] on the enum `SafeTemplateEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SafeTemplateEnum_new" AS ENUM ('YC - Valuation Cap, no Discount', 'YC - Discount, no Valuation Cap', 'YC - MFN, no Valuation Cap, no Discount', 'YC - Valuation Cap, Pro Rata, no Discount', 'YC - Discount, Pro Rata, no Valuation Cap', 'YC - MFN, Pro Rata, no Valuation Cap & Discount', 'Custom');
ALTER TABLE "Safe" ALTER COLUMN "safeTemplate" TYPE "SafeTemplateEnum_new" USING ("safeTemplate"::text::"SafeTemplateEnum_new");
ALTER TYPE "SafeTemplateEnum" RENAME TO "SafeTemplateEnum_old";
ALTER TYPE "SafeTemplateEnum_new" RENAME TO "SafeTemplateEnum";
DROP TYPE "SafeTemplateEnum_old";
COMMIT;
