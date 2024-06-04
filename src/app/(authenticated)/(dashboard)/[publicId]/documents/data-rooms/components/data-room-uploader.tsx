"use client";

import Modal from "@/components/common/modal";
import Uploader, { type UploadReturn } from "@/components/ui/uploader";
import { TAG } from "@/lib/tags";
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
        shouldUpload
        multiple={true}
        identifier={companyPublicId}
        keyPrefix={`data-room/${dataRoom.publicId}/file`}
        tags={[TAG.DATA_ROOM]}
        onSuccess={async (upload: UploadReturn) => {
          const document = await documentMutation.mutateAsync({
            name: upload.name,
            bucketId: upload.id,
          });

          await dataRoomMutation.mutateAsync({
            name: dataRoom.name,
            publicId: dataRoom.publicId,
            documents: [
              {
                documentId: document.id,
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
