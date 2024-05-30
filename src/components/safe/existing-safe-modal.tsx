import { FormValueProvider } from "@/providers/form-value-provider";
import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "../ui/stepper";
import { GeneralDetails } from "./steps/general-details";
import { InvestorDetails } from "./steps/investor-details";
import { SafeDocuments } from "./steps/safe-documents";

export function ExistingSafeModal(props: Omit<StepperModalProps, "children">) {
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

        <StepperStep title="Documents">
          <StepperModalContent>
            <SafeDocuments />
          </StepperModalContent>
        </StepperStep>
      </FormValueProvider>
    </StepperModal>
  );
}
