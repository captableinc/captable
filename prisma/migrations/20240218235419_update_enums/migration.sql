/*
  Warnings:

  - The `status` column on the `Membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `access` column on the `Membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipStatusEnum" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "MembershipAccessEnum" AS ENUM ('ADMIN', 'STAKEHOLDER');

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "status",
ADD COLUMN     "status" "MembershipStatusEnum" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "access",
ADD COLUMN     "access" "MembershipAccessEnum" NOT NULL DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "Team";

-- DropEnum
DROP TYPE "MEMBERHIP_STATUS";

-- DropEnum
DROP TYPE "MEMBERSHIP_ACCESS";

-- DropEnum
DROP TYPE "TeamStatus";

-- CreateIndex
CREATE INDEX "Membership_status_idx" ON "Membership"("status");
