"use client";

import Modal from "@/components/common/modal";
import Uploader, { type UploadReturn } from "@/components/ui/uploader";
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

  const { mutateAsync } = api.dataRoom.save.useMutation();

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
        onSuccess={async (document: UploadReturn) => {
          await mutateAsync({
            name: dataRoom.name,
            publicId: dataRoom.publicId,
            documents: [
              {
                documentId: document.key,
              },
            ],
          });

          router.refresh();
          // setOpen(false);
        }}
      />
    </Modal>
  );
};

export default DataRoomUploader;
