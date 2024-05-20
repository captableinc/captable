"use client";

import Modal from "@/components/common/modal";
import Uploader from "@/components/ui/uploader";
import { TAG } from "@/constants/bucket-tags";
import { api } from "@/trpc/react";
import type { DataRoom } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DataRoomUploaderProps = {
  trigger: React.ReactNode;
  companyPublicId: string;
  dataRoom: DataRoom;
};

const DataRoomUploader = ({
  trigger,
  companyPublicId,
  dataRoom,
}: DataRoomUploaderProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const dataRoomMutation = api.dataRoom.save.useMutation();
  const documentMutation = api.document.create.useMutation();

  return (
    <Modal
      title="Upload documents"
      subtitle="Upload a document to your data room."
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <Uploader
        multiple={true}
        identifier={companyPublicId}
        keyPrefix={`data-room/${dataRoom.publicId}/file`}
        tags={[TAG.DATA_ROOM]}
        onSuccess={async (bucketData) => {
          if (bucketData.length > 0 && bucketData[0]) {
            const returnedDocuments = await documentMutation.mutateAsync([
              ...bucketData.map(({ id, name }) => ({ bucketId: id, name })),
            ]);

            const documentIds = returnedDocuments.map(({ id }) => ({
              documentId: id,
            }));

            await dataRoomMutation.mutateAsync({
              name: dataRoom.name,
              publicId: dataRoom.publicId,
              documents: documentIds,
            });
            router.refresh();
            // setOpen(false);
          }
        }}
      />
    </Modal>
  );
};

export default DataRoomUploader;
