-- CreateTable
CREATE TABLE "EsignAudit" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EsignAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EsignAudit_companyId_idx" ON "EsignAudit"("companyId");

-- CreateIndex
CREATE INDEX "EsignAudit_templateId_idx" ON "EsignAudit"("templateId");

-- CreateIndex
CREATE INDEX "EsignAudit_recipientId_idx" ON "EsignAudit"("recipientId");
