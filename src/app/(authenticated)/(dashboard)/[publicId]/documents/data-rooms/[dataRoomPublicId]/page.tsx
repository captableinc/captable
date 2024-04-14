"use server";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import DataRoomSettings from "../components/data-room-settings";

const DataRoomSettinsPage = async ({
  params: { publicId, dataRoomPublicId },
}: {
  params: { publicId: string; dataRoomPublicId: string };
}) => {
  const session = await getServerAuthSession();
  const companyId = session?.user.companyId;

  const dataRoom = await db.dataRoom.findFirstOrThrow({
    where: {
      publicId: dataRoomPublicId,
      companyId,
    },
  });

  return <DataRoomSettings dataRoom={dataRoom} companyPublicId={publicId} />;
};

export default DataRoomSettinsPage;
