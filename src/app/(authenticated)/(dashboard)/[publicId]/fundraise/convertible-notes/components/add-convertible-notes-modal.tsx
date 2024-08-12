import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";

export function AddConvertibleNotesModal(
  props: Omit<StepperModalProps, "children">,
) {
  return (
    <StepperModal {...props}>
      <StepperStep title="General details">
        <StepperModalContent>
          <div>hello</div>
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
