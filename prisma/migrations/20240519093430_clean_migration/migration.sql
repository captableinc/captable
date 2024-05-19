-- CreateEnum
CREATE TYPE "CredentialDeviceTypeEnum" AS ENUM ('SINGLE_DEVICE', 'MULTI_DEVICE');

-- CreateEnum
CREATE TYPE "MemberStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "StakeholderTypeEnum" AS ENUM ('INDIVIDUAL', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "StakeholderRelationshipEnum" AS ENUM ('ADVISOR', 'BOARD_MEMBER', 'CONSULTANT', 'EMPLOYEE', 'EX_ADVISOR', 'EX_CONSULTANT', 'EX_EMPLOYEE', 'EXECUTIVE', 'FOUNDER', 'INVESTOR', 'NON_US_EMPLOYEE', 'OFFICER', 'OTHER');

-- CreateEnum
CREATE TYPE "ShareTypeEnum" AS ENUM ('COMMON', 'PREFERRED');

-- CreateEnum
CREATE TYPE "SharePrefixEnum" AS ENUM ('CS', 'PS');

-- CreateEnum
CREATE TYPE "ConversionRightsEnum" AS ENUM ('CONVERTS_TO_FUTURE_ROUND', 'CONVERTS_TO_SHARE_CLASS_ID');

-- CreateEnum
CREATE TYPE "CancellationBehaviorEnum" AS ENUM ('RETIRE', 'RETURN_TO_POOL', 'HOLD_AS_CAPITAL_STOCK', 'DEFINED_PER_PLAN_SECURITY');

-- CreateEnum
CREATE TYPE "FieldTypes" AS ENUM ('TEXT', 'RADIO', 'EMAIL', 'DATE', 'DATETIME', 'TEXTAREA', 'CHECKBOX', 'SIGNATURE', 'SELECT');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "EsignRecipientStatus" AS ENUM ('SENT', 'SIGNED', 'PENDING');

-- CreateEnum
CREATE TYPE "SecuritiesStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SIGNED', 'PENDING');

-- CreateEnum
CREATE TYPE "VestingScheduleEnum" AS ENUM ('VESTING_0_0_0', 'VESTING_0_0_1', 'VESTING_4_1_0', 'VESTING_4_1_1', 'VESTING_4_3_1', 'VESTING_4_6_1', 'VESTING_4_12_1');

-- CreateEnum
CREATE TYPE "ShareLegendsEnum" AS ENUM ('US_SECURITIES_ACT', 'SALE_AND_ROFR', 'TRANSFER_RESTRICTIONS');

-- CreateEnum
CREATE TYPE "OptionTypeEnum" AS ENUM ('ISO', 'NSO', 'RSU');

-- CreateEnum
CREATE TYPE "OptionStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'EXERCISED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SafeTypeEnum" AS ENUM ('PRE_MONEY', 'POST_MONEY');

-- CreateEnum
CREATE TYPE "SafeStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SafeTemplateEnum" AS ENUM ('Valuation Cap, no Discount', 'Discount, no Valuation Cap', 'MFN, no Valuation Cap, no Discount', 'Valuation Cap, no Discount, include Pro Rata Rights', 'Discount, no Valuation Cap, include Pro Rata Rights', 'MFN, no Valuation Cap, no Discount, include Pro Rata Rights', 'Custom');

-- CreateEnum
CREATE TYPE "ConvertibleStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConvertibleTypeEnum" AS ENUM ('CCD', 'OCD', 'NOTE');

-- CreateEnum
CREATE TYPE "ConvertibleInterestMethodEnum" AS ENUM ('SIMPLE', 'COMPOUND');

-- CreateEnum
CREATE TYPE "ConvertibleInterestAccrualEnum" AS ENUM ('DAILY', 'MONTHLY', 'SEMI_ANNUALLY', 'ANNUALLY', 'YEARLY', 'CONTINUOUSLY');

-- CreateEnum
CREATE TYPE "ConvertibleInterestPaymentScheduleEnum" AS ENUM ('DEFERRED', 'PAY_AT_MATURITY');

-- CreateEnum
CREATE TYPE "UpdateStatusEnum" AS ENUM ('DRAFT', 'PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "lastSignedIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identityProvider" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "credentialId" BYTEA NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "counter" BIGINT NOT NULL,
    "credentialDeviceType" "CredentialDeviceTypeEnum" NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasskeyVerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasskeyVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "secondaryId" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "publicId" TEXT NOT NULL,
    "website" TEXT,
    "incorporationType" TEXT NOT NULL,
    "incorporationDate" TIMESTAMP(3) NOT NULL,
    "incorporationCountry" TEXT NOT NULL,
    "incorporationState" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "status" "MemberStatusEnum" NOT NULL DEFAULT 'PENDING',
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "workEmail" TEXT,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "institutionName" TEXT,
    "stakeholderType" "StakeholderTypeEnum" NOT NULL DEFAULT 'INDIVIDUAL',
    "currentRelationship" "StakeholderRelationshipEnum" NOT NULL DEFAULT 'EMPLOYEE',
    "taxId" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipcode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "summary" TEXT,
    "action" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" JSONB NOT NULL,
    "target" JSONB[],
    "context" JSONB NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareClass" (
    "id" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "classType" "ShareTypeEnum" NOT NULL DEFAULT 'COMMON',
    "prefix" "SharePrefixEnum" NOT NULL DEFAULT 'CS',
    "initialSharesAuthorized" BIGINT NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "stockholderApprovalDate" TIMESTAMP(3) NOT NULL,
    "votesPerShare" INTEGER NOT NULL,
    "parValue" DOUBLE PRECISION NOT NULL,
    "pricePerShare" DOUBLE PRECISION NOT NULL,
    "seniority" INTEGER NOT NULL,
    "conversionRights" "ConversionRightsEnum" NOT NULL DEFAULT 'CONVERTS_TO_FUTURE_ROUND',
    "convertsToShareClassId" TEXT,
    "liquidationPreferenceMultiple" DOUBLE PRECISION NOT NULL,
    "participationCapMultiple" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquityPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "planEffectiveDate" TIMESTAMP(3),
    "initialSharesReserved" BIGINT NOT NULL,
    "defaultCancellatonBehavior" "CancellationBehaviorEnum" NOT NULL,
    "comments" TEXT,
    "companyId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquityPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bucket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    "uploaderId" TEXT,
    "companyId" TEXT NOT NULL,
    "shareId" TEXT,
    "optionId" TEXT,
    "safeId" TEXT,
    "convertibleNoteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRoomDocument" (
    "id" TEXT NOT NULL,
    "dataRoomId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataRoomDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRoomRecipient" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "dataRoomId" TEXT NOT NULL,
    "memberId" TEXT,
    "stakeholderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRoomRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateRecipient" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,
    "memberId" TEXT,
    "stakeholderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentShare" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "linkExpiresAt" TIMESTAMP(3) NOT NULL,
    "recipients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailProtected" BOOLEAN NOT NULL DEFAULT false,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldTypes" NOT NULL DEFAULT 'TEXT',
    "defaultValue" TEXT NOT NULL DEFAULT '',
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "prefilledValue" TEXT,
    "top" INTEGER NOT NULL,
    "left" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "recipientId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "viewportHeight" INTEGER NOT NULL,
    "viewportWidth" INTEGER NOT NULL,
    "page" INTEGER NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "orderedDelivery" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "bucketId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedOn" TIMESTAMP(3),

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EsignRecipient" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "templateId" TEXT NOT NULL,
    "status" "EsignRecipientStatus" NOT NULL DEFAULT 'PENDING',
    "memberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EsignRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "status" "SecuritiesStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "certificateId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerShare" DOUBLE PRECISION,
    "capitalContribution" DOUBLE PRECISION,
    "ipContribution" DOUBLE PRECISION,
    "debtCancelled" DOUBLE PRECISION,
    "otherContributions" DOUBLE PRECISION,
    "vestingSchedule" "VestingScheduleEnum" NOT NULL,
    "companyLegends" "ShareLegendsEnum"[],
    "issueDate" TIMESTAMP(3) NOT NULL,
    "rule144Date" TIMESTAMP(3),
    "vestingStartDate" TIMESTAMP(3),
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "shareClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exercisePrice" DOUBLE PRECISION NOT NULL,
    "type" "OptionTypeEnum" NOT NULL,
    "status" "OptionStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "vestingSchedule" "VestingScheduleEnum" NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "vestingStartDate" TIMESTAMP(3) NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "rule144Date" TIMESTAMP(3) NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "equityPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "shares" BIGINT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,
    "shareClassId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Safe" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "SafeTypeEnum" NOT NULL DEFAULT 'POST_MONEY',
    "status" "SafeStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "capital" DOUBLE PRECISION NOT NULL,
    "safeTemplate" "SafeTemplateEnum",
    "valuationCap" DOUBLE PRECISION,
    "discountRate" DOUBLE PRECISION,
    "mfn" BOOLEAN NOT NULL DEFAULT false,
    "proRata" BOOLEAN NOT NULL DEFAULT false,
    "additionalTerms" TEXT,
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Safe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConvertibleNote" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "status" "ConvertibleStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "type" "ConvertibleTypeEnum" NOT NULL DEFAULT 'NOTE',
    "capital" DOUBLE PRECISION NOT NULL,
    "conversionCap" DOUBLE PRECISION,
    "discountRate" DOUBLE PRECISION,
    "mfn" BOOLEAN,
    "additionalTerms" TEXT,
    "interestRate" DOUBLE PRECISION,
    "interestMethod" "ConvertibleInterestMethodEnum",
    "interestAccrual" "ConvertibleInterestAccrualEnum",
    "interestPaymentSchedule" "ConvertibleInterestPaymentScheduleEnum",
    "stakeholderId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "boardApprovalDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConvertibleNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "html" TEXT NOT NULL,
    "status" "UpdateStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EsignAudit" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "recipientId" TEXT,
    "action" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EsignAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Passkey_userId_idx" ON "Passkey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasskeyVerificationToken_id_key" ON "PasskeyVerificationToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PasskeyVerificationToken_token_key" ON "PasskeyVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_secondaryId_key" ON "VerificationToken"("secondaryId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Company_publicId_key" ON "Company"("publicId");

-- CreateIndex
CREATE INDEX "Member_companyId_idx" ON "Member"("companyId");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_companyId_userId_key" ON "Member"("companyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder_email_key" ON "Stakeholder"("email");

-- CreateIndex
CREATE INDEX "Stakeholder_companyId_idx" ON "Stakeholder"("companyId");

-- CreateIndex
CREATE INDEX "Audit_companyId_idx" ON "Audit"("companyId");

-- CreateIndex
CREATE INDEX "ShareClass_companyId_idx" ON "ShareClass"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ShareClass_companyId_idx_key" ON "ShareClass"("companyId", "idx");

-- CreateIndex
CREATE INDEX "EquityPlan_shareClassId_idx" ON "EquityPlan"("shareClassId");

-- CreateIndex
CREATE INDEX "EquityPlan_companyId_idx" ON "EquityPlan"("companyId");

-- CreateIndex
CREATE INDEX "Document_bucketId_idx" ON "Document"("bucketId");

-- CreateIndex
CREATE INDEX "Document_uploaderId_idx" ON "Document"("uploaderId");

-- CreateIndex
CREATE INDEX "Document_companyId_idx" ON "Document"("companyId");

-- CreateIndex
CREATE INDEX "Document_shareId_idx" ON "Document"("shareId");

-- CreateIndex
CREATE INDEX "Document_optionId_idx" ON "Document"("optionId");

-- CreateIndex
CREATE INDEX "Document_safeId_idx" ON "Document"("safeId");

-- CreateIndex
CREATE INDEX "Document_convertibleNoteId_idx" ON "Document"("convertibleNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_publicId_key" ON "Document"("publicId");

-- CreateIndex
CREATE INDEX "DataRoom_publicId_idx" ON "DataRoom"("publicId");

-- CreateIndex
CREATE INDEX "DataRoom_companyId_idx" ON "DataRoom"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRoom_publicId_key" ON "DataRoom"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRoom_companyId_name_key" ON "DataRoom"("companyId", "name");

-- CreateIndex
CREATE INDEX "DataRoomDocument_dataRoomId_idx" ON "DataRoomDocument"("dataRoomId");

-- CreateIndex
CREATE INDEX "DataRoomDocument_documentId_idx" ON "DataRoomDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRoomDocument_dataRoomId_documentId_key" ON "DataRoomDocument"("dataRoomId", "documentId");

-- CreateIndex
CREATE INDEX "DataRoomRecipient_id_dataRoomId_idx" ON "DataRoomRecipient"("id", "dataRoomId");

-- CreateIndex
CREATE INDEX "DataRoomRecipient_memberId_idx" ON "DataRoomRecipient"("memberId");

-- CreateIndex
CREATE INDEX "DataRoomRecipient_dataRoomId_idx" ON "DataRoomRecipient"("dataRoomId");

-- CreateIndex
CREATE INDEX "DataRoomRecipient_stakeholderId_idx" ON "DataRoomRecipient"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRoomRecipient_dataRoomId_email_key" ON "DataRoomRecipient"("dataRoomId", "email");

-- CreateIndex
CREATE INDEX "UpdateRecipient_id_updateId_idx" ON "UpdateRecipient"("id", "updateId");

-- CreateIndex
CREATE INDEX "UpdateRecipient_memberId_idx" ON "UpdateRecipient"("memberId");

-- CreateIndex
CREATE INDEX "UpdateRecipient_updateId_idx" ON "UpdateRecipient"("updateId");

-- CreateIndex
CREATE INDEX "UpdateRecipient_stakeholderId_idx" ON "UpdateRecipient"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "UpdateRecipient_updateId_email_key" ON "UpdateRecipient"("updateId", "email");

-- CreateIndex
CREATE INDEX "DocumentShare_documentId_idx" ON "DocumentShare"("documentId");

-- CreateIndex
CREATE INDEX "TemplateField_templateId_idx" ON "TemplateField"("templateId");

-- CreateIndex
CREATE INDEX "TemplateField_recipientId_idx" ON "TemplateField"("recipientId");

-- CreateIndex
CREATE INDEX "Template_bucketId_idx" ON "Template"("bucketId");

-- CreateIndex
CREATE INDEX "Template_uploaderId_idx" ON "Template"("uploaderId");

-- CreateIndex
CREATE INDEX "Template_companyId_idx" ON "Template"("companyId");

-- CreateIndex
CREATE INDEX "EsignRecipient_memberId_idx" ON "EsignRecipient"("memberId");

-- CreateIndex
CREATE INDEX "EsignRecipient_templateId_idx" ON "EsignRecipient"("templateId");

-- CreateIndex
CREATE INDEX "Share_companyId_idx" ON "Share"("companyId");

-- CreateIndex
CREATE INDEX "Share_shareClassId_idx" ON "Share"("shareClassId");

-- CreateIndex
CREATE INDEX "Share_stakeholderId_idx" ON "Share"("stakeholderId");

-- CreateIndex
CREATE INDEX "Option_companyId_idx" ON "Option"("companyId");

-- CreateIndex
CREATE INDEX "Option_equityPlanId_idx" ON "Option"("equityPlanId");

-- CreateIndex
CREATE INDEX "Option_stakeholderId_idx" ON "Option"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "Option_companyId_grantId_key" ON "Option"("companyId", "grantId");

-- CreateIndex
CREATE INDEX "Investment_companyId_idx" ON "Investment"("companyId");

-- CreateIndex
CREATE INDEX "Investment_stakeholderId_idx" ON "Investment"("stakeholderId");

-- CreateIndex
CREATE INDEX "Investment_shareClassId_idx" ON "Investment"("shareClassId");

-- CreateIndex
CREATE INDEX "Safe_companyId_idx" ON "Safe"("companyId");

-- CreateIndex
CREATE INDEX "Safe_stakeholderId_idx" ON "Safe"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "Safe_publicId_companyId_key" ON "Safe"("publicId", "companyId");

-- CreateIndex
CREATE INDEX "ConvertibleNote_companyId_idx" ON "ConvertibleNote"("companyId");

-- CreateIndex
CREATE INDEX "ConvertibleNote_stakeholderId_idx" ON "ConvertibleNote"("stakeholderId");

-- CreateIndex
CREATE UNIQUE INDEX "ConvertibleNote_publicId_companyId_key" ON "ConvertibleNote"("publicId", "companyId");

-- CreateIndex
CREATE INDEX "Update_publicId_idx" ON "Update"("publicId");

-- CreateIndex
CREATE INDEX "Update_authorId_idx" ON "Update"("authorId");

-- CreateIndex
CREATE INDEX "Update_companyId_idx" ON "Update"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Update_publicId_key" ON "Update"("publicId");

-- CreateIndex
CREATE INDEX "EsignAudit_companyId_idx" ON "EsignAudit"("companyId");

-- CreateIndex
CREATE INDEX "EsignAudit_templateId_idx" ON "EsignAudit"("templateId");

-- CreateIndex
CREATE INDEX "EsignAudit_recipientId_idx" ON "EsignAudit"("recipientId");
