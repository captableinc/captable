import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { FormValueProvider } from "@/providers/form-value-provider";
import { AddConvertibleNotesForm } from "./add-convertible-notes-form";
import { UploadDocumentStep } from "./upload-document-step";

export function AddConvertibleNotesModal(
  props: Omit<StepperModalProps, "children">,
) {
  return (
    <StepperModal {...props}>
      <FormValueProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <AddConvertibleNotesForm />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Documents">
          <StepperModalContent>
            <UploadDocumentStep />
          </StepperModalContent>
        </StepperStep>
      </FormValueProvider>
    </StepperModal>
  );
}
