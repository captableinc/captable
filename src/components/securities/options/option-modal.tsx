import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { GeneralDetails } from "./steps";

export const OptionModal = (props: Omit<StepperModalProps, "children">) => {
  return (
    <StepperModal {...props}>
      <StepperStep title="General details">
        <StepperModalContent>
          <GeneralDetails />
        </StepperModalContent>
      </StepperStep>
    </StepperModal>
  );
};
