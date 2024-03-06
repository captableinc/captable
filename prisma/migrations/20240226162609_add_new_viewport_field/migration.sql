/*
  Warnings:

  - Added the required column `viewportHeight` to the `TemplateField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewportWidth` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateField" ADD COLUMN     "viewportHeight" INTEGER NOT NULL,
ADD COLUMN     "viewportWidth" INTEGER NOT NULL;
