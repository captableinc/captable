/*
  Warnings:

  - You are about to alter the column `width` on the `TemplateField` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `height` on the `TemplateField` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `left` on the `TemplateField` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `top` on the `TemplateField` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TemplateField" ALTER COLUMN "width" SET DATA TYPE INTEGER,
ALTER COLUMN "height" SET DATA TYPE INTEGER,
ALTER COLUMN "left" SET DATA TYPE INTEGER,
ALTER COLUMN "top" SET DATA TYPE INTEGER;
