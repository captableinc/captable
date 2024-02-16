/*
  Warnings:

  - The values [convertsToFutureRound,convertsToShareClassId] on the enum `ConversionRightsEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [notSigned,signed] on the enum `EsignRecipientStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [text,textArea,radio,checkBox,signature,date,dateTime,email] on the enum `FieldTypes` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,accepted,declined] on the enum `MEMBERHIP_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,stakeholder] on the enum `MEMBERSHIP_ACCESS` will be removed. If these variants are still used in the database, this will fail.
  - The values [common,preferred] on the enum `ShareTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [draft,completed] on the enum `TemplateStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `verificationTokenToken` on the `EsignRecipient` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StakeholderTypeEnum" AS ENUM ('INDIVIDUAL', 'INSTITUTION');

-- AlterEnum
BEGIN;
CREATE TYPE "ConversionRightsEnum_new" AS ENUM ('CONVERTS_TO_FUTURE_ROUND', 'CONVERTS_TO_SHARE_CLASS_ID');
ALTER TABLE "ShareClass" ALTER COLUMN "conversionRights" DROP DEFAULT;
ALTER TABLE "ShareClass" ALTER COLUMN "conversionRights" TYPE "ConversionRightsEnum_new" USING ("conversionRights"::text::"ConversionRightsEnum_new");
ALTER TYPE "ConversionRightsEnum" RENAME TO "ConversionRightsEnum_old";
ALTER TYPE "ConversionRightsEnum_new" RENAME TO "ConversionRightsEnum";
DROP TYPE "ConversionRightsEnum_old";
ALTER TABLE "ShareClass" ALTER COLUMN "conversionRights" SET DEFAULT 'CONVERTS_TO_FUTURE_ROUND';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EsignRecipientStatus_new" AS ENUM ('SENT', 'SIGNED', 'PENDING');
ALTER TABLE "EsignRecipient" ALTER COLUMN "status" TYPE "EsignRecipientStatus_new" USING ("status"::text::"EsignRecipientStatus_new");
ALTER TYPE "EsignRecipientStatus" RENAME TO "EsignRecipientStatus_old";
ALTER TYPE "EsignRecipientStatus_new" RENAME TO "EsignRecipientStatus";
DROP TYPE "EsignRecipientStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FieldTypes_new" AS ENUM ('TEXT', 'RADIO', 'EMAIL', 'DATE', 'DATETIME', 'TEXTAREA', 'CHECKBOX', 'SIGNATURE');
ALTER TABLE "TemplateField" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "TemplateField" ALTER COLUMN "type" TYPE "FieldTypes_new" USING ("type"::text::"FieldTypes_new");
ALTER TYPE "FieldTypes" RENAME TO "FieldTypes_old";
ALTER TYPE "FieldTypes_new" RENAME TO "FieldTypes";
DROP TYPE "FieldTypes_old";
ALTER TABLE "TemplateField" ALTER COLUMN "type" SET DEFAULT 'TEXT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MEMBERHIP_STATUS_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
ALTER TABLE "Membership" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "status" TYPE "MEMBERHIP_STATUS_new" USING ("status"::text::"MEMBERHIP_STATUS_new");
ALTER TYPE "MEMBERHIP_STATUS" RENAME TO "MEMBERHIP_STATUS_old";
ALTER TYPE "MEMBERHIP_STATUS_new" RENAME TO "MEMBERHIP_STATUS";
DROP TYPE "MEMBERHIP_STATUS_old";
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MEMBERSHIP_ACCESS_new" AS ENUM ('ADMIN', 'STAKEHOLDER');
ALTER TABLE "Membership" ALTER COLUMN "access" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "access" TYPE "MEMBERSHIP_ACCESS_new" USING ("access"::text::"MEMBERSHIP_ACCESS_new");
ALTER TYPE "MEMBERSHIP_ACCESS" RENAME TO "MEMBERSHIP_ACCESS_old";
ALTER TYPE "MEMBERSHIP_ACCESS_new" RENAME TO "MEMBERSHIP_ACCESS";
DROP TYPE "MEMBERSHIP_ACCESS_old";
ALTER TABLE "Membership" ALTER COLUMN "access" SET DEFAULT 'ADMIN';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ShareTypeEnum_new" AS ENUM ('COMMON', 'PREFERRED');
ALTER TABLE "ShareClass" ALTER COLUMN "classType" DROP DEFAULT;
ALTER TABLE "ShareClass" ALTER COLUMN "classType" TYPE "ShareTypeEnum_new" USING ("classType"::text::"ShareTypeEnum_new");
ALTER TYPE "ShareTypeEnum" RENAME TO "ShareTypeEnum_old";
ALTER TYPE "ShareTypeEnum_new" RENAME TO "ShareTypeEnum";
DROP TYPE "ShareTypeEnum_old";
ALTER TABLE "ShareClass" ALTER COLUMN "classType" SET DEFAULT 'COMMON';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TemplateStatus_new" AS ENUM ('DRAFT', 'COMPLETE');
ALTER TABLE "Template" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Template" ALTER COLUMN "status" TYPE "TemplateStatus_new" USING ("status"::text::"TemplateStatus_new");
ALTER TYPE "TemplateStatus" RENAME TO "TemplateStatus_old";
ALTER TYPE "TemplateStatus_new" RENAME TO "TemplateStatus";
DROP TYPE "TemplateStatus_old";
ALTER TABLE "Template" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropIndex
DROP INDEX "EsignRecipient_verificationTokenToken_idx";

-- AlterTable
ALTER TABLE "EsignRecipient" DROP COLUMN "verificationTokenToken",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "access" SET DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "ShareClass" ALTER COLUMN "classType" SET DEFAULT 'COMMON',
ALTER COLUMN "conversionRights" SET DEFAULT 'CONVERTS_TO_FUTURE_ROUND';

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "TemplateField" ALTER COLUMN "type" SET DEFAULT 'TEXT';

-- CreateTable
CREATE TABLE "Stakeholder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "StakeholderTypeEnum" NOT NULL DEFAULT 'INSTITUTION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("id")
);
