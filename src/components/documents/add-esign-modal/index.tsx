import { EsignFormProvider } from "@/providers/esign-form-provider";
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
      title="Upload equity document"
      subtitle=""
      trigger={<Button variant="ghost">Upload E-Sign Document</Button>}
    >
      <EsignFormProvider>
        <UploadDocumentStep />
        <AddRecipientStep companyPublicId={companyPublicId} />
      </EsignFormProvider>
    </StepperModal>
  );
}
