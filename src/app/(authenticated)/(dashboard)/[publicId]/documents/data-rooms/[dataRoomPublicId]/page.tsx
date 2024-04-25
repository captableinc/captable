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
  const { dataRoom, documents } = await api.dataRoom.getDataRoom.query({
    dataRoomPublicId,
  });
  const contacts = await api.dataRoom.getContacts.query();

  if (!dataRoom) {
    return notFound();
  }

  return (
    <DataRoomFiles
      dataRoom={dataRoom}
      contacts={contacts}
      documents={documents}
      companyPublicId={publicId}
    />
  );
};

export default DataRoomSettinsPage;
