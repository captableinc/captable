"use client";

import { ContributionDetails } from "@/components/securities/shares/steps/contribution-details";
import { Documents } from "@/components/securities/shares/steps/documents";
import { GeneralDetails } from "@/components/securities/shares/steps/general-details";
import { RelevantDates } from "@/components/securities/shares/steps/relevant-dates";
import {
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { AddShareFormProvider } from "@/providers/add-share-form-provider";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";

export type TShareClasses = RouterOutputs["shareClass"]["get"];
export type TStakeholders = RouterOutputs["stakeholder"]["getStakeholders"];

function ContributionDetailsStep({
  stakeholders,
}: {
  stakeholders: TStakeholders;
}) {
  return <ContributionDetails stakeholders={stakeholders} />;
}

function GeneralDetailsStep({ shareClasses }: { shareClasses: TShareClasses }) {
  return <GeneralDetails shareClasses={shareClasses} />;
}

type IssueShareModalProps = Omit<StepperModalProps, "children"> & {
  shouldClientFetch: boolean;
  stakeholders: TStakeholders | [];
  shareClasses: TShareClasses | [];
};

export const IssueShareModal = ({
  shouldClientFetch = false,
  stakeholders,
  shareClasses,
  ...rest
}: IssueShareModalProps) => {
  // const _stakeholders = api.stakeholder.getStakeholders.useQuery(undefined, {
  //   enabled: shouldClientFetch,
  // })?.data;
  const _stakeholders =
    api.stakeholder.getStakeholders.useQuery(undefined).data;

  // const _shareClasses = api.shareClass.get.useQuery(undefined, {
  //   enabled: shouldClientFetch,
  // })?.data;
  const _shareClasses = api.shareClass.get.useQuery(undefined).data;

  const __stakeholders = stakeholders.length
    ? stakeholders
    : (_stakeholders as unknown as TStakeholders);

  const __shareClasses = shareClasses.length
    ? shareClasses
    : (_shareClasses as unknown as TShareClasses);

  return (
    <StepperModal {...rest}>
      <AddShareFormProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <GeneralDetailsStep shareClasses={__shareClasses} />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Contribution details">
          <StepperModalContent>
            <ContributionDetailsStep stakeholders={__stakeholders} />
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
