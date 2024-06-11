"use client";

import { EsignFormProvider } from "@/providers/esign-form-provider";
import { RiAddFill } from "@remixicon/react";
import { Button } from "../../ui/button";
import { StepperModal } from "../../ui/stepper";
import { AddRecipientStep } from "./steps/add-recepients-step";
import { UploadDocumentStep } from "./steps/upload-document-step";

interface AddEsignModalProps {
  companyPublicId: string;
}

export function AddEsignModal({ companyPublicId }: AddEsignModalProps) {
  return (
    <StepperModal
      size={"4xl"}
      title="eSign a document"
      subtitle=""
      trigger={
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" /> Upload a document
        </Button>
      }
    >
      <EsignFormProvider>
        <UploadDocumentStep />
        <AddRecipientStep companyPublicId={companyPublicId} />
      </EsignFormProvider>
    </StepperModal>
  );
}
