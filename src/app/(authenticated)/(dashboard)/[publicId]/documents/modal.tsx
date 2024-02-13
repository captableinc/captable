import { RiAddFill } from "@remixicon/react";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import Uploader from "@/components/ui/uploader";

const DocumentUploadModal = () => {
  return (
    <Modal
      title="Upload a document"
      subtitle="Upload a document to your company's document library."
      trigger={
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" />
          Upload a document
        </Button>
      }
    >
      <Uploader />
    </Modal>
  );
};

export default DocumentUploadModal;
