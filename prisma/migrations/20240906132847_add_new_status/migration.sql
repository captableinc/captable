/*
  Warnings:

  - The values [SENT,WAITING] on the enum `TemplateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TemplateStatus_new" AS ENUM ('DRAFT', 'COMPLETE', 'PENDING', 'CANCELLED');
ALTER TABLE "Template" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Template" ALTER COLUMN "status" TYPE "TemplateStatus_new" USING ("status"::text::"TemplateStatus_new");
ALTER TYPE "TemplateStatus" RENAME TO "TemplateStatus_old";
ALTER TYPE "TemplateStatus_new" RENAME TO "TemplateStatus";
DROP TYPE "TemplateStatus_old";
ALTER TABLE "Template" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
