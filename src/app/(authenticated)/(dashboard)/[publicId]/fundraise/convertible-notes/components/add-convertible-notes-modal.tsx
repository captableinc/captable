import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { AddConvertibleNotesForm } from "./add-convertible-notes-form";

export function AddConvertibleNotesModal(
  props: Omit<StepperModalProps, "children">,
) {
  return (
    <StepperModal {...props}>
      <StepperStep title="General details">
        <StepperModalContent>
          <AddConvertibleNotesForm />
        </StepperModalContent>
      </StepperStep>
      <StepperStep title="Documents">
        <StepperModalContent>
          <div>hello</div>
        </StepperModalContent>
      </StepperStep>
    </StepperModal>
  );
}
