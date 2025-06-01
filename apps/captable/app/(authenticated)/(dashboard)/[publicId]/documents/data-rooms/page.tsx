"use server";

import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { serverSideSession } from "@captable/auth/server";
import {
  count,
  dataRoomDocuments,
  dataRooms,
  db,
  desc,
  eq,
} from "@captable/db";
import { RiAddFill, RiFolderCheckFill } from "@remixicon/react";
import { headers } from "next/headers";
import { Fragment } from "react";
import DataRoomPopover from "./components/data-room-popover";
import Folders from "./components/dataroom-folders";

const getDataRooms = async (companyId: string) => {
  return await db
    .select({
      id: dataRooms.id,
      name: dataRooms.name,
      publicId: dataRooms.publicId,
      public: dataRooms.public,
      companyId: dataRooms.companyId,
      createdAt: dataRooms.createdAt,
      updatedAt: dataRooms.updatedAt,
      _count: {
        documents: count(dataRoomDocuments.documentId),
      },
    })
    .from(dataRooms)
    .leftJoin(dataRoomDocuments, eq(dataRooms.id, dataRoomDocuments.dataRoomId))
    .where(eq(dataRooms.companyId, companyId))
    .groupBy(
      dataRooms.id,
      dataRooms.name,
      dataRooms.publicId,
      dataRooms.public,
      dataRooms.companyId,
      dataRooms.createdAt,
      dataRooms.updatedAt,
    )
    .orderBy(desc(dataRooms.createdAt));
};

const DataRoomPage = async () => {
  const session = await serverSideSession({ headers: await headers() });

  if (!session || !session.user) {
    return null;
  }

  const { companyId, companyPublicId } = session.user;
  const dataRooms = await getDataRooms(companyId);

  return (
    <Fragment>
      {dataRooms.length > 0 ? (
        <Folders companyPublicId={companyPublicId} folders={dataRooms} />
      ) : (
        <Fragment>
          <EmptyState
            icon={<RiFolderCheckFill />}
            title="You don't have any data rooms yet."
            subtitle="A secure spaces to share multiple documents with investors, stakeholders and external parties."
          >
            <DataRoomPopover
              trigger={
                <Button>
                  <RiAddFill className="mr-2 h-5 w-5" />
                  Create a data room
                </Button>
              }
            />
          </EmptyState>
        </Fragment>
      )}
    </Fragment>
  );
};

export default DataRoomPage;
