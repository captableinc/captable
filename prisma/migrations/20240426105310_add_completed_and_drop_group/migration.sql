/*
  Warnings:

  - You are about to drop the column `group` on the `EsignRecipient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EsignRecipient" DROP COLUMN "group";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "completedOn" TIMESTAMP(3);
