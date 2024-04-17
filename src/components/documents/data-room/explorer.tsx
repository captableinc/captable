import type { DataRoomDocument } from "@prisma/client";

const DataRoomFileExplorer = (documents: DataRoomDocument[]) => {
  <div className="flex flex-col gap-y-8">
    Documents JSON.stringify(documents, null, 2)
  </div>;
};

export default DataRoomFileExplorer;
