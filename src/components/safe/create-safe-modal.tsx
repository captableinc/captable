import { RiAddFill } from "@remixicon/react";
import { Button } from "../ui/button";
import { StepperModal, StepperModalContent, StepperStep } from "../ui/stepper";
import { GeneralDetails } from "./steps/general-details";
import { InvestorDetails } from "./steps/investor-details";

export function CreateSafeModal() {
  return (
    <StepperModal
      title="Create a new SAFE agreement"
      subtitle="Create, sign and send a new SAFE agreement to your investors."
      trigger={
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" /> Safe
        </Button>
      }
    >
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
    </StepperModal>
  );
}
