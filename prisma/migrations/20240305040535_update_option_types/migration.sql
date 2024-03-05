/*
  Warnings:

  - The values [STOCK_OPTION,WARRANT] on the enum `OptionTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OptionTypeEnum_new" AS ENUM ('ISO', 'NSO', 'RSU');
ALTER TABLE "Option" ALTER COLUMN "type" TYPE "OptionTypeEnum_new" USING ("type"::text::"OptionTypeEnum_new");
ALTER TYPE "OptionTypeEnum" RENAME TO "OptionTypeEnum_old";
ALTER TYPE "OptionTypeEnum_new" RENAME TO "OptionTypeEnum";
DROP TYPE "OptionTypeEnum_old";
COMMIT;
