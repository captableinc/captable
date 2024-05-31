/*
  Warnings:

  - A unique constraint covering the columns `[companyId,certificateId]` on the table `Share` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Share_companyId_certificateId_key" ON "Share"("companyId", "certificateId");
