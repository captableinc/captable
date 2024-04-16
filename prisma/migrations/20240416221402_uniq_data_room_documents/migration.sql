/*
  Warnings:

  - A unique constraint covering the columns `[dataRoomId,documentId]` on the table `DataRoomDocument` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataRoomDocument_dataRoomId_documentId_key" ON "DataRoomDocument"("dataRoomId", "documentId");
