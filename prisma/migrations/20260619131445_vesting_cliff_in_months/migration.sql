/*
  Vesting and cliff durations are now expressed in MONTHS instead of years.

  - Rename "vestingYears" -> "vestingMonths" and "cliffYears" -> "cliffMonths"
    on the "Share" and "Option" tables.
  - Convert existing values from years to months by multiplying by 12
    (e.g. a 4-year / 1-year-cliff grant becomes 48 / 12 months).
*/

-- AlterTable
ALTER TABLE "Share" RENAME COLUMN "vestingYears" TO "vestingMonths";
ALTER TABLE "Share" RENAME COLUMN "cliffYears" TO "cliffMonths";

-- AlterTable
ALTER TABLE "Option" RENAME COLUMN "vestingYears" TO "vestingMonths";
ALTER TABLE "Option" RENAME COLUMN "cliffYears" TO "cliffMonths";

-- Convert existing durations from years to months
UPDATE "Share" SET "vestingMonths" = "vestingMonths" * 12, "cliffMonths" = "cliffMonths" * 12;
UPDATE "Option" SET "vestingMonths" = "vestingMonths" * 12, "cliffMonths" = "cliffMonths" * 12;
