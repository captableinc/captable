/*
  Warnings:

  - You are about to drop the column `placeholder` on the `TemplateField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "placeholder",
ADD COLUMN     "defaultValue" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "readOnly" BOOLEAN NOT NULL DEFAULT false;
