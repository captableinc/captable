-- CreateTable
CREATE TABLE "DocumentShare" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "recipients" JSONB,
    "emailProtected" BOOLEAN NOT NULL DEFAULT false,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id")
);
