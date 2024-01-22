-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" JSONB NOT NULL,
    "target" JSONB[],
    "context" JSONB NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);
