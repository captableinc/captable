/*
  Warnings:

  - The values [PENDING,ACCEPTED,DECLINED] on the enum `MEMBERHIP_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - The values [READ,WRITE,ADMIN] on the enum `MEMBERSHIP_ACCESS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MEMBERHIP_STATUS_new" AS ENUM ('pending', 'accepted', 'declined');
ALTER TABLE "Membership" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "status" TYPE "MEMBERHIP_STATUS_new" USING ("status"::text::"MEMBERHIP_STATUS_new");
ALTER TYPE "MEMBERHIP_STATUS" RENAME TO "MEMBERHIP_STATUS_old";
ALTER TYPE "MEMBERHIP_STATUS_new" RENAME TO "MEMBERHIP_STATUS";
DROP TYPE "MEMBERHIP_STATUS_old";
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MEMBERSHIP_ACCESS_new" AS ENUM ('admin', 'stakeholder');
ALTER TABLE "Membership" ALTER COLUMN "access" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "access" TYPE "MEMBERSHIP_ACCESS_new" USING ("access"::text::"MEMBERSHIP_ACCESS_new");
ALTER TYPE "MEMBERSHIP_ACCESS" RENAME TO "MEMBERSHIP_ACCESS_old";
ALTER TYPE "MEMBERSHIP_ACCESS_new" RENAME TO "MEMBERSHIP_ACCESS";
DROP TYPE "MEMBERSHIP_ACCESS_old";
ALTER TABLE "Membership" ALTER COLUMN "access" SET DEFAULT 'stakeholder';
COMMIT;

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "access" SET DEFAULT 'stakeholder';
