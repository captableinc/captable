"use server";

import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { RiAddFill, RiFolderCheckFill } from "@remixicon/react";
import { Fragment } from "react";
import DataRoomModal from "./modal";

const getDataRooms = async (companyId: string) => {
  return db.dataRoom.findMany({
    where: {
      companyId,
    },

    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      documents: true,
      recipients: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 10,
  });
};

const DataRoomPage = async () => {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    return null;
  }

  const { companyId, companyPublicId } = session?.user;

  const dataRooms = await getDataRooms(companyId);

  console.log({ dataRooms });

  return (
    <Fragment>
      {dataRooms.length > 0 ? (
        <>Data</>
      ) : (
        <EmptyState
          icon={<RiFolderCheckFill />}
          title="You have no data rooms."
          subtitle="Get started by creating a new data room."
        >
          <DataRoomModal
            companyId={companyPublicId}
            trigger={
              <Button size="lg">
                <RiAddFill className="mr-2 h-5 w-5" />
                Create a data room
              </Button>
            }
          />
        </EmptyState>
      )}
    </Fragment>
  );
};

export default DataRoomPage;
