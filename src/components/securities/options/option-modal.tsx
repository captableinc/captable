import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { StockOptionFormProvider } from "@/providers/stock-option-form-provider";
import { GeneralDetails } from "./steps";

export const OptionModal = (props: Omit<StepperModalProps, "children">) => {
  return (
    <StepperModal {...props}>
      <StockOptionFormProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <GeneralDetails />
          </StepperModalContent>
        </StepperStep>
      </StockOptionFormProvider>
    </StepperModal>
  );
};
