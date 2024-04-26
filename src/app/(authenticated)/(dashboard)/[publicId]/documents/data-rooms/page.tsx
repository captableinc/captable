"use server";

import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { RiAddFill, RiFolderCheckFill } from "@remixicon/react";
import { Fragment } from "react";
import DataRoomPopover from "./components/data-room-popover";
import Folders from "./components/dataroom-folders";

const getDataRooms = async (companyId: string) => {
  return db.dataRoom.findMany({
    where: {
      companyId,
    },

    include: {
      _count: {
        select: { documents: true },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const DataRoomPage = async () => {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    return null;
  }

  const { companyId, companyPublicId } = session?.user;
  const dataRooms = await getDataRooms(companyId);

  return (
    <Fragment>
      {dataRooms.length > 0 ? (
        <Folders companyPublicId={companyPublicId} folders={dataRooms} />
      ) : (
        <Fragment>
          <EmptyState
            icon={<RiFolderCheckFill />}
            title="No data rooms found 🙈"
            subtitle="A secure spaces to share multiple documents with investors, stakeholders and external parties."
          >
            <DataRoomPopover
              trigger={
                <Button size="lg">
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
