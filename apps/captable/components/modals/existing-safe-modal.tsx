"use client";

import { GeneralDetails } from "@/components/safe/steps/general-details";
import { InvestorDetails } from "@/components/safe/steps/investor-details";
import { SafeDocuments } from "@/components/safe/steps/safe-documents";
import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { FormValueProvider } from "@/providers/form-value-provider";

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
