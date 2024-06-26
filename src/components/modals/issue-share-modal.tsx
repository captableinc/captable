"use client";

import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { AddShareFormProvider } from "@/providers/add-share-form-provider";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { ContributionDetails } from "../securities/shares/steps/contribution-details";
import { Documents } from "../securities/shares/steps/documents";
import { GeneralDetails } from "../securities/shares/steps/general-details";
import { RelevantDates } from "../securities/shares/steps/relevant-dates";

export type TShareClasses = RouterOutputs["shareClass"]["get"];
export type TStakeholders = RouterOutputs["stakeholder"]["getStakeholders"];

function ContributionDetailsStep({
  stakeholders,
  shouldClientFetch,
}: {
  shouldClientFetch: boolean;
  stakeholders: TStakeholders;
}) {
  const _stakeholders = api.stakeholder.getStakeholders.useQuery(undefined, {
    enabled: shouldClientFetch,
  })?.data;

  return <ContributionDetails stakeholders={stakeholders || stakeholders} />;
}

function GeneralDetailsStep({
  shareClasses,
  shouldClientFetch,
}: {
  shareClasses: TShareClasses;
  shouldClientFetch: boolean;
}) {
  const _shareClasses = api.shareClass.get.useQuery(undefined, {
    enabled: shouldClientFetch,
  }).data;

  return <GeneralDetails shareClasses={shareClasses || _shareClasses} />;
}

type IssueShareModalProps = Omit<StepperModalProps, "children"> & {
  shouldClientFetch: boolean;
  stakeholders: TStakeholders | [];
  shareClasses: TShareClasses | [];
};

export const IssueShareModal = ({
  shouldClientFetch,
  stakeholders,
  shareClasses,
  ...rest
}: IssueShareModalProps) => {
  return (
    <StepperModal {...rest}>
      <AddShareFormProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <GeneralDetailsStep
              shouldClientFetch={shouldClientFetch}
              shareClasses={shareClasses}
            />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Contribution details">
          <StepperModalContent>
            <ContributionDetailsStep
              shouldClientFetch={shouldClientFetch}
              stakeholders={stakeholders}
            />
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
