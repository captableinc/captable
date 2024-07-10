-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'CUSTOM');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "customRoleId" TEXT,
ADD COLUMN     "role" "Roles" DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "CustomRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "permissions" JSONB[],

    CONSTRAINT "CustomRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomRole_companyId_idx" ON "CustomRole"("companyId");

-- CreateIndex
CREATE INDEX "Member_customRoleId_idx" ON "Member"("customRoleId");
