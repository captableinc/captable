"use server";

import FilePreview from "@/components/file/preview";
import { SharePageLayout } from "@/components/share/page-layout";
import { type JWTVerifyResult, decode } from "@/lib/jwt";
import { getPresignedGetUrl } from "@/server/file-uploads";
import {
  and,
  buckets,
  companies,
  dataRoomDocuments,
  dataRoomRecipients,
  dataRooms,
  db,
  documents,
  eq,
} from "@captable/db";
import { RiFolder3Fill as FolderIcon } from "@remixicon/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const DataRoomPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string; bucketId: string }>;
  searchParams: Promise<{ token: string }>;
}) => {
  const { publicId, bucketId } = await params;
  const { token } = await searchParams;
  let decodedToken: JWTVerifyResult | null = null;

  try {
    decodedToken = await decode(token);
  } catch (_error) {
    return notFound();
  }

  const { companyId, dataRoomId, recipientId } = decodedToken.payload;
  if (!companyId || !recipientId || !dataRoomId) {
    return notFound();
  }

  // Extract values to ensure proper typing
  const recipientIdStr = recipientId as string;
  const dataRoomIdStr = dataRoomId as string;
  const companyIdStr = companyId as string;

  const [recipient] = await db
    .select({ id: dataRoomRecipients.id })
    .from(dataRoomRecipients)
    .where(
      and(
        eq(dataRoomRecipients.id, recipientIdStr),
        eq(dataRoomRecipients.dataRoomId, dataRoomIdStr),
      ),
    )
    .limit(1);

  if (!recipient) {
    return notFound();
  }

  // Get the dataRoom with company
  const [dataRoomResult] = await db
    .select({
      id: dataRooms.id,
      name: dataRooms.name,
      publicId: dataRooms.publicId,
      public: dataRooms.public,
      companyId: dataRooms.companyId,
      createdAt: dataRooms.createdAt,
      updatedAt: dataRooms.updatedAt,
      companyName: companies.name,
      companyLogo: companies.logo,
    })
    .from(dataRooms)
    .innerJoin(companies, eq(dataRooms.companyId, companies.id))
    .where(eq(dataRooms.publicId, publicId))
    .limit(1);

  if (!dataRoomResult) {
    return notFound();
  }

  // Get all documents in the dataRoom with their buckets
  const documentsResult = await db
    .select({
      dataRoomDocumentId: dataRoomDocuments.id,
      documentId: documents.id,
      bucketId: buckets.id,
      bucketName: buckets.name,
      bucketKey: buckets.key,
      bucketMimeType: buckets.mimeType,
      bucketSize: buckets.size,
      bucketTags: buckets.tags,
      bucketCreatedAt: buckets.createdAt,
      bucketUpdatedAt: buckets.updatedAt,
    })
    .from(dataRoomDocuments)
    .innerJoin(documents, eq(dataRoomDocuments.documentId, documents.id))
    .innerJoin(buckets, eq(documents.bucketId, buckets.id))
    .where(eq(dataRoomDocuments.dataRoomId, dataRoomResult.id));

  // Reconstruct the data structure to match original format
  const dataRoom = {
    ...dataRoomResult,
    company: {
      id: dataRoomResult.companyId,
      name: dataRoomResult.companyName,
      logo: dataRoomResult.companyLogo,
    },
    documents: documentsResult.map((doc) => ({
      id: doc.dataRoomDocumentId,
      document: {
        id: doc.documentId,
        bucket: {
          id: doc.bucketId,
          name: doc.bucketName,
          key: doc.bucketKey,
          mimeType: doc.bucketMimeType,
          size: doc.bucketSize,
          tags: doc.bucketTags,
          createdAt: doc.bucketCreatedAt,
          updatedAt: doc.bucketUpdatedAt,
        },
      },
    })),
  };

  const dataRoomFile = dataRoom.documents.find(
    (doc) => doc.document.bucket.id === bucketId,
  );

  if (
    dataRoomIdStr !== dataRoom.id ||
    dataRoom?.companyId !== companyIdStr ||
    !dataRoomFile
  ) {
    return notFound();
  }

  const file = dataRoomFile?.document.bucket;

  if (!file) {
    return notFound();
  }

  const company = dataRoom.company;
  const remoteFile = await getPresignedGetUrl(file.key);

  return (
    <SharePageLayout
      medium="dataRoom"
      company={{
        name: company.name,
        logo: company.logo,
      }}
      title={
        <div className="flex">
          <FolderIcon
            className="mr-3 mt-1 h-6 w-6 text-primary/60"
            aria-hidden="true"
          />

          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-primary/60">Data room / </span>
            <Link
              href={`/data-rooms/${publicId}?token=${token}`}
              className="text-primary/60 hover:text-primary/90 hover:underline"
            >
              {dataRoom.name}
            </Link>
            {` / ${file.name}`}
          </h1>
        </div>
      }
    >
      <FilePreview
        name={file.name}
        url={remoteFile.url}
        mimeType={file.mimeType}
      />
    </SharePageLayout>
  );
};

export default DataRoomPage;
