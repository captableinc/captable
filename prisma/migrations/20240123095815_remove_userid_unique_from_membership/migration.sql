-- DropIndex
DROP INDEX "Membership_userId_key";

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");
