"use server";

import { SharePageLayout } from "@/components/share/page-layout";
import { db } from "@/server/db";
import { RiFolder3Fill as FolderIcon } from "@remixicon/react";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const DataRoomPage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const dataRoom = await db.dataRoom.findFirst({
    where: {
      publicId,
    },

    include: {
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!dataRoom) {
    return notFound();
  }

  const company = dataRoom?.company;

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
      <Fragment>
        <div className="mt-5">test</div>
      </Fragment>
    </SharePageLayout>
  );
};

export default DataRoomPage;
