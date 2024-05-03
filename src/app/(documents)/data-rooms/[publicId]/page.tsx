"use server";

import DataRoomFileExplorer from "@/components/documents/data-room/explorer";
import { SharePageLayout } from "@/components/share/page-layout";
import { decode, type JWTVerifyResult } from "@/lib/jwt";
import { db } from "@/server/db";
import { RiFolder3Fill as FolderIcon } from "@remixicon/react";
import { notFound } from "next/navigation";

const DataRoomPage = async ({
  params: { publicId },
  searchParams: { token },
}: {
  params: { publicId: string };
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

  if (dataRoomId !== dataRoom.id || dataRoom?.companyId !== companyId) {
    return notFound();
  }

  const company = dataRoom.company;
  const documents = dataRoom.documents.map((doc) => doc.document.bucket);

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
            {dataRoom.name}
          </h1>
        </div>
      }
    >
      <div>
        <DataRoomFileExplorer
          shared={true}
          jwtToken={token}
          documents={documents}
          companyPublicId={company.publicId}
          dataRoomPublicId={publicId}
        />
      </div>
    </SharePageLayout>
  );
};

export default DataRoomPage;
