-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "cliffYears" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vestingYears" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "cliffYears" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vestingYears" INTEGER NOT NULL DEFAULT 0;
