/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Update` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Update_publicId_key" ON "Update"("publicId");
