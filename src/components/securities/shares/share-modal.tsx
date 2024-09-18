import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { AddShareFormProvider } from "@/providers/add-share-form-provider";
import { api } from "@/trpc/server";
import { ContributionDetails } from "./steps/contribution-details";
import { Documents } from "./steps/documents";
import { GeneralDetails } from "./steps/general-details";
import { RelevantDates } from "./steps/relevant-dates";

async function ContributionDetailsStep() {
  const stakeholders = await api.stakeholder.getStakeholders();
  return <ContributionDetails stakeholders={stakeholders} />;
}

async function GeneralDetailsStep() {
  const shareClasses = await api.shareClass.get();
  return <GeneralDetails shareClasses={shareClasses} />;
}

export const ShareModal = (props: Omit<StepperModalProps, "children">) => {
  return (
    <StepperModal {...props}>
      <AddShareFormProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <GeneralDetailsStep />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Contribution details">
          <StepperModalContent>
            <ContributionDetailsStep />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Relevant dates">
          <StepperModalContent>
            <RelevantDates />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Documents">
          <StepperModalContent>
            <Documents />
          </StepperModalContent>
        </StepperStep>
      </AddShareFormProvider>
    </StepperModal>
  );
};
