"use server";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import DataRoomFiles from "../components/data-room-files";

const DataRoomSettinsPage = async ({
  params: { publicId, dataRoomPublicId },
}: {
  params: { publicId: string; dataRoomPublicId: string };
}) => {
  const session = await getServerAuthSession();
  const { dataRoom, documents, recipients } =
    await api.dataRoom.getDataRoom.query({
      dataRoomPublicId,
      getRecipients: true,
    });

  if (!dataRoom) {
    return notFound();
  }

  return (
    <DataRoomFiles
      dataRoom={dataRoom}
      documents={documents}
      recipients={recipients}
      companyPublicId={publicId}
    />
  );
};

export default DataRoomSettinsPage;
