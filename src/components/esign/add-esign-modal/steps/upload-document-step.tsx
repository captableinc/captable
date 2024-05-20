import {
  StepperModalContent,
  StepperStep,
  useStepper,
} from "@/components/ui/stepper";
import Uploader from "@/components/ui/uploader";
import { TAG } from "@/constants/bucket-tags";
import { useEsignValues } from "@/providers/esign-form-provider";

export function UploadDocumentStep() {
  const { next } = useStepper();
  const { setValue } = useEsignValues();

  return (
    <StepperStep title="Upload a document">
      <StepperModalContent>
        <Uploader
          identifier={""}
          tags={[TAG.ESIGN]}
          shouldUpload={false}
          keyPrefix="equity-doc"
          onSuccess={(file) => {
            setValue({ document: file });
            next();
          }}
          accept={{
            "application/pdf": [".pdf"],
          }}
        />
      </StepperModalContent>
    </StepperStep>
  );
}
