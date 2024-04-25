-- CreateTable
CREATE TABLE "DataRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRoomDocument" (
    "id" TEXT NOT NULL,
    "dataRoomId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DataRoomDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRoomRecipient" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataRoomId" TEXT NOT NULL,
    "stakeholderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRoomRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataRoom_companyId_idx" ON "DataRoom"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRoom_publicId_key" ON "DataRoom"("publicId");

-- CreateIndex
CREATE INDEX "DataRoomDocument_dataRoomId_idx" ON "DataRoomDocument"("dataRoomId");

-- CreateIndex
CREATE INDEX "DataRoomDocument_documentId_idx" ON "DataRoomDocument"("documentId");

-- CreateIndex
CREATE INDEX "DataRoomRecipient_dataRoomId_idx" ON "DataRoomRecipient"("dataRoomId");

-- CreateIndex
CREATE INDEX "DataRoomRecipient_stakeholderId_idx" ON "DataRoomRecipient"("stakeholderId");
