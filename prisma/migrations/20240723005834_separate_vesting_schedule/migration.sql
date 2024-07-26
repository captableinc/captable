/*
  Warnings:

  - You are about to drop the column `vestingSchedule` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `vestingSchedule` on the `Share` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "vestingSchedule";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "vestingSchedule";

-- DropEnum
DROP TYPE "VestingScheduleEnum";
