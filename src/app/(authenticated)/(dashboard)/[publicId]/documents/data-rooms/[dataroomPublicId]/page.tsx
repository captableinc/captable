"use server";

import DataRoomSettings from "../settings";

const DataRoomSettinsPage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  return <DataRoomSettings companyPublicId={publicId} />;
};

export default DataRoomSettinsPage;
