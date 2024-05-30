/*
  Warnings:

  - A unique constraint covering the columns `[linkedEmail]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "linkedEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Member_linkedEmail_key" ON "Member"("linkedEmail");
