/*
  Warnings:

  - You are about to drop the column `positionX` on the `TemplateField` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `TemplateField` table. All the data in the column will be lost.
  - Added the required column `left` to the `TemplateField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `top` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "positionX",
DROP COLUMN "positionY",
ADD COLUMN     "left" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "top" DECIMAL(65,30) NOT NULL;
