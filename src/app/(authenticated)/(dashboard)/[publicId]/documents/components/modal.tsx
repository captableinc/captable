"use client";

import Modal from "@/components/common/modal";
import Uploader from "@/components/ui/uploader";
import { TAG } from "@/constants/bucket-tags";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DocumentUploadModalProps = {
  trigger: React.ReactNode;
  companyPublicId: string;
};

const DocumentUploadModal = ({
  trigger,
  companyPublicId,
}: DocumentUploadModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutateAsync } = api.document.create.useMutation();

  return (
    <Modal
      title="Upload a document"
      subtitle="Upload a document to your company's document library."
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <Uploader
        identifier={companyPublicId}
        keyPrefix="generic-document"
        tags={[TAG.GENERIC]}
        onSuccess={async (bucketData) => {
          if (bucketData.length > 0 && bucketData[0]) {
            await mutateAsync([
              {
                name: bucketData[0].name,
                bucketId: bucketData[0].id,
              },
            ]);

            router.refresh();
            setOpen(false);
          }
        }}
      />
    </Modal>
  );
};

export default DocumentUploadModal;
