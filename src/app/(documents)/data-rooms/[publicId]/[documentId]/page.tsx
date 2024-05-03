"use server";

import { SharePageLayout } from "@/components/share/page-layout";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import type { Company, DataRoom } from "@prisma/client";
import { RiFolder3Fill as FolderIcon } from "@remixicon/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const DataRoomPage = async ({
  params: { publicId, documentId },
  searchParams: { token },
}: {
  params: { publicId: string; documentId: string };
  searchParams: { token: string };
}) => {
  const { dataRoom, company } = await api.dataRoom.getDataRoom.query({
    dataRoomPublicId: publicId,
    include: {
      company: true,
    },
  });

  const file = await db.bucket.findFirst({
    where: {
      id: documentId,
    },
  });

  if (!dataRoom || !company || !file) {
    return notFound();
  }

  const currentCompany = company as Company;
  const currentDataRoom = dataRoom as DataRoom;
  const currentFile = file;

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
            <Link
              href={`/data-rooms/${publicId}?token=${token}`}
              className="text-primary/60 hover:text-primary/90 hover:underline"
            >
              {currentDataRoom.name}
            </Link>
            {` / ${currentFile.name}`}
          </h1>
        </div>
      }
    >
      <div>File preview</div>
    </SharePageLayout>
  );
};

export default DataRoomPage;
