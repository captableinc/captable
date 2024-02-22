"use client";

import { useRouter } from "next/navigation";
import Modal from "../shared/modal";
import { Button } from "../ui/button";
import { Uploader } from "../ui/uploader";
import { api } from "@/trpc/react";

interface EquityDocumentUploadProps {
  companyPublicId: string;
}

export function EquityDocumentUpload({
  companyPublicId,
}: EquityDocumentUploadProps) {
  const router = useRouter();

  const { mutateAsync } = api.template.create.useMutation();

  return (
    <Modal
      title="Upload equity document"
      subtitle=""
      trigger={<Button>Upload Document</Button>}
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
}
