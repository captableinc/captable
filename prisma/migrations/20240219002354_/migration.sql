/*
  Warnings:

  - The values [ACCEPTED,DECLINED] on the enum `MembershipStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `access` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Membership` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MembershipStatusEnum_new" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');
ALTER TABLE "Membership" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "status" TYPE "MembershipStatusEnum_new" USING ("status"::text::"MembershipStatusEnum_new");
ALTER TYPE "MembershipStatusEnum" RENAME TO "MembershipStatusEnum_old";
ALTER TYPE "MembershipStatusEnum_new" RENAME TO "MembershipStatusEnum";
DROP TYPE "MembershipStatusEnum_old";
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "access",
DROP COLUMN "active";

-- DropEnum
DROP TYPE "MembershipAccessEnum";
