"use client";

import { useState } from "react";
import Modal from "@/components/shared/modal";
import Uploader from "@/components/ui/uploader";

type DocumentUploadModalProps = {
  trigger: React.ReactNode;
};

const DocumentUploadModal = ({ trigger }: DocumentUploadModalProps) => {
  const [open, setOpen] = useState(false);

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
      <Uploader setOpen={setOpen} />
    </Modal>
  );
};

export default DocumentUploadModal;
