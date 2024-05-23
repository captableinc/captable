/*
  Warnings:

  - The values [RETIRE,RETURN_TO_POOL,HOLD_AS_CAPITAL_STOCK,DEFINED_PER_PLAN_SECURITY] on the enum `CancellationBehaviorEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [CONVERTS_TO_FUTURE_ROUND,CONVERTS_TO_SHARE_CLASS_ID] on the enum `ConversionRightsEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [DAILY,MONTHLY,SEMI_ANNUALLY,ANNUALLY,YEARLY,CONTINUOUSLY] on the enum `ConvertibleInterestAccrualEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [SIMPLE,COMPOUND] on the enum `ConvertibleInterestMethodEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [DEFERRED,PAY_AT_MATURITY] on the enum `ConvertibleInterestPaymentScheduleEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,ACTIVE,PENDING,EXPIRED,CANCELLED] on the enum `ConvertibleStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [CCD,OCD,NOTE] on the enum `ConvertibleTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [SINGLE_DEVICE,MULTI_DEVICE] on the enum `CredentialDeviceTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [SENT,SIGNED,PENDING] on the enum `EsignRecipientStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [TEXT,RADIO,EMAIL,DATE,DATETIME,TEXTAREA,CHECKBOX,SIGNATURE,SELECT] on the enum `FieldTypes` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE,PENDING] on the enum `MemberStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,ACTIVE,EXERCISED,EXPIRED,CANCELLED] on the enum `OptionStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [ISO,NSO,RSU] on the enum `OptionTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,ACTIVE,PENDING,EXPIRED,CANCELLED] on the enum `SafeStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [PRE_MONEY,POST_MONEY] on the enum `SafeTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,DRAFT,SIGNED,PENDING] on the enum `SecuritiesStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [US_SECURITIES_ACT,SALE_AND_ROFR,TRANSFER_RESTRICTIONS] on the enum `ShareLegendsEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [CS,PS] on the enum `SharePrefixEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMMON,PREFERRED] on the enum `ShareTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADVISOR,BOARD_MEMBER,CONSULTANT,EMPLOYEE,EX_ADVISOR,EX_CONSULTANT,EX_EMPLOYEE,EXECUTIVE,FOUNDER,INVESTOR,NON_US_EMPLOYEE,OFFICER,OTHER] on the enum `StakeholderRelationshipEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [INDIVIDUAL,INSTITUTION] on the enum `StakeholderTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,COMPLETE] on the enum `TemplateStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,PUBLIC,PRIVATE] on the enum `UpdateStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [VESTING_0_0_0,VESTING_0_0_1,VESTING_4_1_0,VESTING_4_1_1,VESTING_4_3_1,VESTING_4_6_1,VESTING_4_12_1] on the enum `VestingScheduleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CancellationBehaviorEnum_new" AS ENUM ('Retire', 'Return to pool', 'Hold as capital stock', 'Defined per plan security');
ALTER TABLE "EquityPlan" ALTER COLUMN "defaultCancellatonBehavior" TYPE "CancellationBehaviorEnum_new" USING ("defaultCancellatonBehavior"::text::"CancellationBehaviorEnum_new");
ALTER TYPE "CancellationBehaviorEnum" RENAME TO "CancellationBehaviorEnum_old";
ALTER TYPE "CancellationBehaviorEnum_new" RENAME TO "CancellationBehaviorEnum";
DROP TYPE "CancellationBehaviorEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConversionRightsEnum_new" AS ENUM ('Converts to future round', 'Converts to share class ID');
ALTER TABLE "ShareClass" ALTER COLUMN "conversionRights" DROP DEFAULT;
ALTER TABLE "ShareClass" ALTER COLUMN "conversionRights" TYPE "ConversionRightsEnum_new" USING ("conversionRights"::text::"ConversionRightsEnum_new");
ALTER TYPE "ConversionRightsEnum" RENAME TO "ConversionRightsEnum_old";
ALTER TYPE "ConversionRightsEnum_new" RENAME TO "ConversionRightsEnum";
DROP TYPE "ConversionRightsEnum_old";
ALTER TABLE "ShareClass" ALTER COLUMN "conversionRights" SET DEFAULT 'Converts to future round';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConvertibleInterestAccrualEnum_new" AS ENUM ('Daily', 'Monthly', 'Semi-annually', 'Annually', 'Yearly', 'Continuously');
ALTER TABLE "ConvertibleNote" ALTER COLUMN "interestAccrual" TYPE "ConvertibleInterestAccrualEnum_new" USING ("interestAccrual"::text::"ConvertibleInterestAccrualEnum_new");
ALTER TYPE "ConvertibleInterestAccrualEnum" RENAME TO "ConvertibleInterestAccrualEnum_old";
ALTER TYPE "ConvertibleInterestAccrualEnum_new" RENAME TO "ConvertibleInterestAccrualEnum";
DROP TYPE "ConvertibleInterestAccrualEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConvertibleInterestMethodEnum_new" AS ENUM ('Simple', 'Compound');
ALTER TABLE "ConvertibleNote" ALTER COLUMN "interestMethod" TYPE "ConvertibleInterestMethodEnum_new" USING ("interestMethod"::text::"ConvertibleInterestMethodEnum_new");
ALTER TYPE "ConvertibleInterestMethodEnum" RENAME TO "ConvertibleInterestMethodEnum_old";
ALTER TYPE "ConvertibleInterestMethodEnum_new" RENAME TO "ConvertibleInterestMethodEnum";
DROP TYPE "ConvertibleInterestMethodEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConvertibleInterestPaymentScheduleEnum_new" AS ENUM ('Deferred', 'Pay at maturity');
ALTER TABLE "ConvertibleNote" ALTER COLUMN "interestPaymentSchedule" TYPE "ConvertibleInterestPaymentScheduleEnum_new" USING ("interestPaymentSchedule"::text::"ConvertibleInterestPaymentScheduleEnum_new");
ALTER TYPE "ConvertibleInterestPaymentScheduleEnum" RENAME TO "ConvertibleInterestPaymentScheduleEnum_old";
ALTER TYPE "ConvertibleInterestPaymentScheduleEnum_new" RENAME TO "ConvertibleInterestPaymentScheduleEnum";
DROP TYPE "ConvertibleInterestPaymentScheduleEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConvertibleStatusEnum_new" AS ENUM ('Draft', 'Active', 'Pending', 'Expired', 'Cancelled');
ALTER TABLE "ConvertibleNote" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ConvertibleNote" ALTER COLUMN "status" TYPE "ConvertibleStatusEnum_new" USING ("status"::text::"ConvertibleStatusEnum_new");
ALTER TYPE "ConvertibleStatusEnum" RENAME TO "ConvertibleStatusEnum_old";
ALTER TYPE "ConvertibleStatusEnum_new" RENAME TO "ConvertibleStatusEnum";
DROP TYPE "ConvertibleStatusEnum_old";
ALTER TABLE "ConvertibleNote" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConvertibleTypeEnum_new" AS ENUM ('Compulsory Convertible Debenture', 'Optionally Convertible Debenture', 'Simple Convertible note');
ALTER TABLE "ConvertibleNote" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "ConvertibleNote" ALTER COLUMN "type" TYPE "ConvertibleTypeEnum_new" USING ("type"::text::"ConvertibleTypeEnum_new");
ALTER TYPE "ConvertibleTypeEnum" RENAME TO "ConvertibleTypeEnum_old";
ALTER TYPE "ConvertibleTypeEnum_new" RENAME TO "ConvertibleTypeEnum";
DROP TYPE "ConvertibleTypeEnum_old";
ALTER TABLE "ConvertibleNote" ALTER COLUMN "type" SET DEFAULT 'Simple Convertible note';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CredentialDeviceTypeEnum_new" AS ENUM ('Single device', 'Multiple device');
ALTER TABLE "Passkey" ALTER COLUMN "credentialDeviceType" TYPE "CredentialDeviceTypeEnum_new" USING ("credentialDeviceType"::text::"CredentialDeviceTypeEnum_new");
ALTER TYPE "CredentialDeviceTypeEnum" RENAME TO "CredentialDeviceTypeEnum_old";
ALTER TYPE "CredentialDeviceTypeEnum_new" RENAME TO "CredentialDeviceTypeEnum";
DROP TYPE "CredentialDeviceTypeEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EsignRecipientStatus_new" AS ENUM ('Sent', 'Signed', 'Pending');
ALTER TABLE "EsignRecipient" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "EsignRecipient" ALTER COLUMN "status" TYPE "EsignRecipientStatus_new" USING ("status"::text::"EsignRecipientStatus_new");
ALTER TYPE "EsignRecipientStatus" RENAME TO "EsignRecipientStatus_old";
ALTER TYPE "EsignRecipientStatus_new" RENAME TO "EsignRecipientStatus";
DROP TYPE "EsignRecipientStatus_old";
ALTER TABLE "EsignRecipient" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FieldTypes_new" AS ENUM ('Text', 'Radio', 'Email', 'Date', 'Datetime', 'Text Area', 'Checkbox', 'Signature', 'Select');
ALTER TABLE "TemplateField" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "TemplateField" ALTER COLUMN "type" TYPE "FieldTypes_new" USING ("type"::text::"FieldTypes_new");
ALTER TYPE "FieldTypes" RENAME TO "FieldTypes_old";
ALTER TYPE "FieldTypes_new" RENAME TO "FieldTypes";
DROP TYPE "FieldTypes_old";
ALTER TABLE "TemplateField" ALTER COLUMN "type" SET DEFAULT 'Text';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MemberStatusEnum_new" AS ENUM ('Active', 'Pending', 'Inactive');
ALTER TABLE "Member" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Member" ALTER COLUMN "status" TYPE "MemberStatusEnum_new" USING ("status"::text::"MemberStatusEnum_new");
ALTER TYPE "MemberStatusEnum" RENAME TO "MemberStatusEnum_old";
ALTER TYPE "MemberStatusEnum_new" RENAME TO "MemberStatusEnum";
DROP TYPE "MemberStatusEnum_old";
ALTER TABLE "Member" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OptionStatusEnum_new" AS ENUM ('Draft', 'Active', 'Exercised', 'Expired', 'Cancelled');
ALTER TABLE "Option" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Option" ALTER COLUMN "status" TYPE "OptionStatusEnum_new" USING ("status"::text::"OptionStatusEnum_new");
ALTER TYPE "OptionStatusEnum" RENAME TO "OptionStatusEnum_old";
ALTER TYPE "OptionStatusEnum_new" RENAME TO "OptionStatusEnum";
DROP TYPE "OptionStatusEnum_old";
ALTER TABLE "Option" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OptionTypeEnum_new" AS ENUM ('Incentive Stock Options', 'Non-satutory Stock Options', 'Restricted Stock Units');
ALTER TABLE "Option" ALTER COLUMN "type" TYPE "OptionTypeEnum_new" USING ("type"::text::"OptionTypeEnum_new");
ALTER TYPE "OptionTypeEnum" RENAME TO "OptionTypeEnum_old";
ALTER TYPE "OptionTypeEnum_new" RENAME TO "OptionTypeEnum";
DROP TYPE "OptionTypeEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SafeStatusEnum_new" AS ENUM ('Draft', 'Active', 'Pending', 'Expired', 'Cancelled');
ALTER TABLE "Safe" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Safe" ALTER COLUMN "status" TYPE "SafeStatusEnum_new" USING ("status"::text::"SafeStatusEnum_new");
ALTER TYPE "SafeStatusEnum" RENAME TO "SafeStatusEnum_old";
ALTER TYPE "SafeStatusEnum_new" RENAME TO "SafeStatusEnum";
DROP TYPE "SafeStatusEnum_old";
ALTER TABLE "Safe" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SafeTypeEnum_new" AS ENUM ('Pre-Money', 'Post-Money');
ALTER TABLE "Safe" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Safe" ALTER COLUMN "type" TYPE "SafeTypeEnum_new" USING ("type"::text::"SafeTypeEnum_new");
ALTER TYPE "SafeTypeEnum" RENAME TO "SafeTypeEnum_old";
ALTER TYPE "SafeTypeEnum_new" RENAME TO "SafeTypeEnum";
DROP TYPE "SafeTypeEnum_old";
ALTER TABLE "Safe" ALTER COLUMN "type" SET DEFAULT 'Post-Money';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SecuritiesStatusEnum_new" AS ENUM ('Active', 'Draft', 'Signed', 'Pending');
ALTER TABLE "Share" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Share" ALTER COLUMN "status" TYPE "SecuritiesStatusEnum_new" USING ("status"::text::"SecuritiesStatusEnum_new");
ALTER TYPE "SecuritiesStatusEnum" RENAME TO "SecuritiesStatusEnum_old";
ALTER TYPE "SecuritiesStatusEnum_new" RENAME TO "SecuritiesStatusEnum";
DROP TYPE "SecuritiesStatusEnum_old";
ALTER TABLE "Share" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ShareLegendsEnum_new" AS ENUM ('US Securities Act of 1933', 'Sale and Right of first refusal', 'Bylaw transfer restrictions');
ALTER TABLE "Share" ALTER COLUMN "companyLegends" TYPE "ShareLegendsEnum_new"[] USING ("companyLegends"::text::"ShareLegendsEnum_new"[]);
ALTER TYPE "ShareLegendsEnum" RENAME TO "ShareLegendsEnum_old";
ALTER TYPE "ShareLegendsEnum_new" RENAME TO "ShareLegendsEnum";
DROP TYPE "ShareLegendsEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SharePrefixEnum_new" AS ENUM ('Common shares', 'Preferred shares');
ALTER TABLE "ShareClass" ALTER COLUMN "prefix" DROP DEFAULT;
ALTER TABLE "ShareClass" ALTER COLUMN "prefix" TYPE "SharePrefixEnum_new" USING ("prefix"::text::"SharePrefixEnum_new");
ALTER TYPE "SharePrefixEnum" RENAME TO "SharePrefixEnum_old";
ALTER TYPE "SharePrefixEnum_new" RENAME TO "SharePrefixEnum";
DROP TYPE "SharePrefixEnum_old";
ALTER TABLE "ShareClass" ALTER COLUMN "prefix" SET DEFAULT 'Common shares';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ShareTypeEnum_new" AS ENUM ('Common', 'Preferred');
ALTER TABLE "ShareClass" ALTER COLUMN "classType" DROP DEFAULT;
ALTER TABLE "ShareClass" ALTER COLUMN "classType" TYPE "ShareTypeEnum_new" USING ("classType"::text::"ShareTypeEnum_new");
ALTER TYPE "ShareTypeEnum" RENAME TO "ShareTypeEnum_old";
ALTER TYPE "ShareTypeEnum_new" RENAME TO "ShareTypeEnum";
DROP TYPE "ShareTypeEnum_old";
ALTER TABLE "ShareClass" ALTER COLUMN "classType" SET DEFAULT 'Common';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StakeholderRelationshipEnum_new" AS ENUM ('Advisor', 'Board Member', 'Consultant', 'Employee', 'Ex-Advisor', 'Ex-Consultant', 'Ex-Employee', 'Executive', 'Founder', 'Investor', 'Non-US Employee', 'Officer', 'Other');
ALTER TABLE "Stakeholder" ALTER COLUMN "currentRelationship" DROP DEFAULT;
ALTER TABLE "Stakeholder" ALTER COLUMN "currentRelationship" TYPE "StakeholderRelationshipEnum_new" USING ("currentRelationship"::text::"StakeholderRelationshipEnum_new");
ALTER TYPE "StakeholderRelationshipEnum" RENAME TO "StakeholderRelationshipEnum_old";
ALTER TYPE "StakeholderRelationshipEnum_new" RENAME TO "StakeholderRelationshipEnum";
DROP TYPE "StakeholderRelationshipEnum_old";
ALTER TABLE "Stakeholder" ALTER COLUMN "currentRelationship" SET DEFAULT 'Employee';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StakeholderTypeEnum_new" AS ENUM ('Individual', 'Institution');
ALTER TABLE "Stakeholder" ALTER COLUMN "stakeholderType" DROP DEFAULT;
ALTER TABLE "Stakeholder" ALTER COLUMN "stakeholderType" TYPE "StakeholderTypeEnum_new" USING ("stakeholderType"::text::"StakeholderTypeEnum_new");
ALTER TYPE "StakeholderTypeEnum" RENAME TO "StakeholderTypeEnum_old";
ALTER TYPE "StakeholderTypeEnum_new" RENAME TO "StakeholderTypeEnum";
DROP TYPE "StakeholderTypeEnum_old";
ALTER TABLE "Stakeholder" ALTER COLUMN "stakeholderType" SET DEFAULT 'Individual';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TemplateStatus_new" AS ENUM ('Draft', 'Complete');
ALTER TABLE "Template" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Template" ALTER COLUMN "status" TYPE "TemplateStatus_new" USING ("status"::text::"TemplateStatus_new");
ALTER TYPE "TemplateStatus" RENAME TO "TemplateStatus_old";
ALTER TYPE "TemplateStatus_new" RENAME TO "TemplateStatus";
DROP TYPE "TemplateStatus_old";
ALTER TABLE "Template" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UpdateStatusEnum_new" AS ENUM ('Draft', 'Public', 'Private');
ALTER TABLE "Update" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Update" ALTER COLUMN "status" TYPE "UpdateStatusEnum_new" USING ("status"::text::"UpdateStatusEnum_new");
ALTER TYPE "UpdateStatusEnum" RENAME TO "UpdateStatusEnum_old";
ALTER TYPE "UpdateStatusEnum_new" RENAME TO "UpdateStatusEnum";
DROP TYPE "UpdateStatusEnum_old";
ALTER TABLE "Update" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VestingScheduleEnum_new" AS ENUM ('Immediate vesting', '1 year cliff with no vesting', '4 years vesting every month with no cliff', '4 years vesting every month with 1 year cliff', '4 years vesting every 3 months with 1 year cliff', '4 years vesting every 6 months with 1 year cliff', '4 years vesting every year with 1 year cliff');
ALTER TABLE "Share" ALTER COLUMN "vestingSchedule" TYPE "VestingScheduleEnum_new" USING ("vestingSchedule"::text::"VestingScheduleEnum_new");
ALTER TABLE "Option" ALTER COLUMN "vestingSchedule" TYPE "VestingScheduleEnum_new" USING ("vestingSchedule"::text::"VestingScheduleEnum_new");
ALTER TYPE "VestingScheduleEnum" RENAME TO "VestingScheduleEnum_old";
ALTER TYPE "VestingScheduleEnum_new" RENAME TO "VestingScheduleEnum";
DROP TYPE "VestingScheduleEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "ConvertibleNote" ALTER COLUMN "status" SET DEFAULT 'Draft',
ALTER COLUMN "type" SET DEFAULT 'Simple Convertible note';

-- AlterTable
ALTER TABLE "EsignRecipient" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "Safe" ALTER COLUMN "type" SET DEFAULT 'Post-Money',
ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "Share" ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "ShareClass" ALTER COLUMN "classType" SET DEFAULT 'Common',
ALTER COLUMN "prefix" SET DEFAULT 'Common shares',
ALTER COLUMN "conversionRights" SET DEFAULT 'Converts to future round';

-- AlterTable
ALTER TABLE "Stakeholder" ALTER COLUMN "stakeholderType" SET DEFAULT 'Individual',
ALTER COLUMN "currentRelationship" SET DEFAULT 'Employee';

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "TemplateField" ALTER COLUMN "type" SET DEFAULT 'Text';

-- AlterTable
ALTER TABLE "Update" ALTER COLUMN "status" SET DEFAULT 'Draft';
