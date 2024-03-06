/*
  Warnings:

  - Added the required column `page` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateField" ADD COLUMN     "page" INTEGER NOT NULL;
