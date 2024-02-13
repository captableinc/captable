import { RiAddFill } from "@remixicon/react";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import Uploader from "@/components/ui/uploader";

type DocumentUploadModalProps = {
  trigger: React.ReactNode;
};

const DocumentUploadModal = ({ trigger }: DocumentUploadModalProps) => {
  return (
    <Modal
      title="Upload a document"
      subtitle="Upload a document to your company's document library."
      trigger={trigger}
    >
      <Uploader />
    </Modal>
  );
};

export default DocumentUploadModal;
