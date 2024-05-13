"use server";

import FilePreview from "@/components/file/preview";
import { SharePageLayout } from "@/components/share/page-layout";
import { type JWTVerifyResult, decode } from "@/lib/jwt";
import { db } from "@/server/db";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { RiFolder3Fill as FolderIcon } from "@remixicon/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const DataRoomPage = async ({
  params: { publicId, bucketId },
  searchParams: { token },
}: {
  params: { publicId: string; bucketId: string };
  searchParams: { token: string };
}) => {
  let decodedToken: JWTVerifyResult | null = null;

  try {
    decodedToken = await decode(token);
  } catch (error) {
    return notFound();
  }

  const { companyId, dataRoomId, recipientId } = decodedToken?.payload;
  if (!companyId || !recipientId || !dataRoomId) {
    return notFound();
  }

  const recipient = await db.dataRoomRecipient.findFirstOrThrow({
    where: {
      id: recipientId,
      dataRoomId,
    },

    select: {
      id: true,
    },
  });

  if (!recipient) {
    return notFound();
  }

  const dataRoom = await db.dataRoom.findFirstOrThrow({
    where: {
      publicId,
    },

    include: {
      company: true,
      documents: {
        include: {
          document: {
            include: {
              bucket: true,
            },
          },
        },
      },
    },
  });

  const dataRoomFile = dataRoom.documents.find(
    (doc) => doc.document.bucket.id === bucketId,
  );

  if (
    dataRoomId !== dataRoom.id ||
    dataRoom?.companyId !== companyId ||
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
