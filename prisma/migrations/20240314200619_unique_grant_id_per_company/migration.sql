/*
  Warnings:

  - A unique constraint covering the columns `[companyId,grantId]` on the table `Option` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Option_companyId_grantId_key" ON "Option"("companyId", "grantId");
