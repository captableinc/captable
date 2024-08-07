/*
  Warnings:

  - You are about to drop the column `hashedToken` on the `AccessToken` table. All the data in the column will be lost.
  - You are about to drop the column `partialToken` on the `AccessToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccessToken" DROP COLUMN "hashedToken",
DROP COLUMN "partialToken";
