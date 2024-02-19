/*
  Warnings:

  - The values [ACCEPTED] on the enum `TeamStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `active` on the `Team` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TeamStatus_new" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');
ALTER TABLE "Team" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Team" ALTER COLUMN "status" TYPE "TeamStatus_new" USING ("status"::text::"TeamStatus_new");
ALTER TYPE "TeamStatus" RENAME TO "TeamStatus_old";
ALTER TYPE "TeamStatus_new" RENAME TO "TeamStatus";
DROP TYPE "TeamStatus_old";
ALTER TABLE "Team" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "active";
