"use client";

import MultiStepFormModal from "@/components/shared/multistepFormModal";
import { ZodAddShareMutationSchema } from "@/trpc/routers/securities-router/schema";
import { type Share } from "@prisma/client";
import {
  DocumentUpload,
  DocumentUploadFields,
  GeneralDetails,
  GeneralDetailsField,
} from "./steps";
import {
  ContributionDetails,
  ContributionDetailsField,
} from "./steps/contribution-details";
import { RelevantDates, RelevantDatesFields } from "./steps/relevant-dates";

type ShareModalProps = {
  title: string;
  subtitle: string | React.ReactNode;
  trigger: string | React.ReactNode;
  initialValues?: Share;
};

const ShareModal = ({
  title,
  subtitle,
  trigger,
  initialValues,
}: ShareModalProps) => {
  const steps = [
    {
      id: 1,
      title: "General details",
      component: GeneralDetails,
      fields: GeneralDetailsField,
    },
    {
      id: 2,
      title: "Contribution details",
      component: ContributionDetails,
      fields: ContributionDetailsField,
    },
    {
      id: 3,
      title: "Relevant dates",
      component: RelevantDates,
      fields: RelevantDatesFields,
    },
    {
      id: 4,
      title: "Upload Documents",
      component: DocumentUpload,
      fields: DocumentUploadFields,
    },
  ];

  const onSubmit = (data: Share) => {
    console.log({ data });
  };

  return (
    <div>
      <MultiStepFormModal
        steps={steps}
        title={title}
        subtitle={subtitle}
        trigger={trigger}
        schema={ZodAddShareMutationSchema}
        onSubmit={onSubmit}
        initialValues={initialValues} // Add the 'initialValues' property here
      />
    </div>
  );
};

export default ShareModal;
