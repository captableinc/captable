/*
  Warnings:

  - The values [YC - Valuation Cap, no Discount,YC - Discount, no Valuation Cap,YC - MFN, no Valuation Cap, no Discount,YC - Valuation Cap, Pro Rata, no Discount,YC - Discount, Pro Rata, no Valuation Cap,YC - MFN, Pro Rata, no Valuation Cap & Discount] on the enum `SafeTemplateEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SafeTemplateEnum_new" AS ENUM ('YC Post Money - Valuation Cap, no Discount', 'YC Post Money - Discount, no Valuation Cap', 'YC Post Money - MFN, no Valuation Cap, no Discount', 'YC Post Money - Valuation Cap, Pro Rata, no Discount', 'YC Post Money - Discount, Pro Rata, no Valuation Cap', 'YC Post Money - MFN, Pro Rata, no Valuation Cap & Discount', 'YC Pre Money - Valuation Cap, no Discount', 'YC Pre Money - Valuation Cap & Discount', 'YC Pre Money - Discount, no Valuation Cap', 'YC Pre Money - MFN, no Valuation Cap', 'Custom');
ALTER TABLE "Safe" ALTER COLUMN "safeTemplate" TYPE "SafeTemplateEnum_new" USING ("safeTemplate"::text::"SafeTemplateEnum_new");
ALTER TYPE "SafeTemplateEnum" RENAME TO "SafeTemplateEnum_old";
ALTER TYPE "SafeTemplateEnum_new" RENAME TO "SafeTemplateEnum";
DROP TYPE "SafeTemplateEnum_old";
COMMIT;
