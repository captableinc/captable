"use client";

import { useRouter } from "next/navigation";
import Modal from "../shared/modal";
import { Button } from "../ui/button";
import { Uploader } from "../ui/uploader";

interface EquityDocumentUploadProps {
  companyPublicId: string;
}

export function EquityDocumentUpload({
  companyPublicId,
}: EquityDocumentUploadProps) {
  const router = useRouter();

  return (
    <Modal
      title="Upload equity document"
      subtitle=""
      trigger={<Button>Upload Document</Button>}
    >
      <Uploader
        identifier={companyPublicId}
        keySuffix="equity-doc-uploads"
        type="EQUITY"
        onSuccess={(data) => {
          router.push(`/${companyPublicId}/templates/${data.publicId}`);
        }}
        accept={{
          "application/pdf": [".pdf"],
        }}
      />
    </Modal>
  );
}
