/*
  Warnings:

  - A unique constraint covering the columns `[companyId,idx]` on the table `ShareClass` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `idx` on the `ShareClass` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ShareClass" DROP COLUMN "idx",
ADD COLUMN     "idx" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShareClass_companyId_idx_key" ON "ShareClass"("companyId", "idx");
