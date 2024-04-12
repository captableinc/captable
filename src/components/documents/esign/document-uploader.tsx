"use client";

import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import Uploader from "@/components/ui/uploader";
import { api } from "@/trpc/react";
import { RiAddFill } from "@remixicon/react";
import { useRouter } from "next/navigation";

interface EsignDocumentUploadProps {
  companyPublicId: string;
}

const EsignDocumentUpload = ({ companyPublicId }: EsignDocumentUploadProps) => {
  const router = useRouter();
  const { mutateAsync } = api.template.create.useMutation();

  return (
    <Modal
      title="Upload equity document"
      subtitle=""
      trigger={
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" />
          Document
        </Button>
      }
    >
      <Uploader
        identifier={companyPublicId}
        keyPrefix="equity-doc"
        onSuccess={async (bucketData) => {
          const equityTemplate = await mutateAsync({
            bucketId: bucketData.id,
            name: bucketData.name,
          });

          router.push(
            `/${companyPublicId}/templates/${equityTemplate.publicId}`,
          );
        }}
        accept={{
          "application/pdf": [".pdf"],
        }}
      />
    </Modal>
  );
};

export default EsignDocumentUpload;
