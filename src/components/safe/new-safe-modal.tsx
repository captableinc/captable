import { FormValueProvider } from "@/providers/form-value-provider";
import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "../ui/stepper";
import { GeneralDetails } from "./steps/general-details";
import { InvestorDetails } from "./steps/investor-details";
import { SafeTemplate } from "./steps/safe-template";

export function NewSafeModal(props: Omit<StepperModalProps, "children">) {
  return (
    <StepperModal {...props}>
      <FormValueProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <GeneralDetails />
          </StepperModalContent>
        </StepperStep>

        <StepperStep title="Investor details">
          <StepperModalContent>
            <InvestorDetails />
          </StepperModalContent>
        </StepperStep>

        <StepperStep title="Safe template">
          <StepperModalContent>
            <SafeTemplate />
          </StepperModalContent>
        </StepperStep>
      </FormValueProvider>
    </StepperModal>
  );
}
