"use server";

import DataRoomFileExplorer from "@/components/documents/data-room/explorer";
import { SharePageLayout } from "@/components/share/page-layout";
import { api } from "@/trpc/server";
import type { Bucket, Company, DataRoom } from "@prisma/client";
import { RiFolder3Fill as FolderIcon } from "@remixicon/react";
import { notFound } from "next/navigation";

const DataRoomPage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const { dataRoom, company, documents } = await api.dataRoom.getDataRoom.query(
    {
      dataRoomPublicId: publicId,
      include: {
        company: true,
      },
    },
  );

  if (!dataRoom) {
    return notFound();
  }

  const currentCompany = company as Company;
  const currentDataRoom = dataRoom as DataRoom;
  const currentDocuments = documents as Bucket[];

  return (
    <SharePageLayout
      medium="dataRoom"
      company={{
        name: currentCompany.name,
        logo: currentCompany.logo,
      }}
      title={
        <div className="flex">
          <FolderIcon
            className="mr-3 mt-1 h-6 w-6 text-primary/60"
            aria-hidden="true"
          />

          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-primary/60">Data room / </span>
            {currentDataRoom.name}
          </h1>
        </div>
      }
    >
      <div>
        <DataRoomFileExplorer
          documents={currentDocuments}
          companyPublicId={currentCompany.publicId}
          dataRoomPublicId={publicId}
        />
      </div>
    </SharePageLayout>
  );
};

export default DataRoomPage;
