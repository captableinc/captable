/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name]` on the table `DataRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataRoom_companyId_name_key" ON "DataRoom"("companyId", "name");
