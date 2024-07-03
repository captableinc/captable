-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPER_USER', 'EMPLOYEE', 'INVESTOR', 'BILLING', 'CUSTOM');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "customRoleId" TEXT,
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'SUPER_USER';

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "permissions" JSONB[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Role_companyId_idx" ON "Role"("companyId");

-- CreateIndex
CREATE INDEX "Member_customRoleId_idx" ON "Member"("customRoleId");
