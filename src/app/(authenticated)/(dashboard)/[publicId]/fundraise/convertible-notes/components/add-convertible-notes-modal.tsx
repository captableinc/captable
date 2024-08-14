import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { FormValueProvider } from "@/providers/form-value-provider";
import { api } from "@/trpc/server";
import { AddConvertibleNotesForm } from "./add-convertible-notes-form";
import { UploadDocumentStep } from "./upload-document-step";

async function AddConvertibleNotesFormStep() {
  const stakeholders = await api.stakeholder.getStakeholders.query();
  return <AddConvertibleNotesForm stakeholders={stakeholders} />;
}

export function AddConvertibleNotesModal(
  props: Omit<StepperModalProps, "children">,
) {
  return (
    <StepperModal {...props}>
      <FormValueProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <AddConvertibleNotesFormStep />
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
