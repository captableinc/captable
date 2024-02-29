-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "shares" BIGINT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,
    "shareClassId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Investment_companyId_idx" ON "Investment"("companyId");

-- CreateIndex
CREATE INDEX "Investment_stakeholderId_idx" ON "Investment"("stakeholderId");

-- CreateIndex
CREATE INDEX "Investment_shareClassId_idx" ON "Investment"("shareClassId");
