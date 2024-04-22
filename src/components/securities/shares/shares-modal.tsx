"use client";

import MultiStepFormModal from "@/components/shared/multistepFormModal";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import {
  ZodAddShareMutationSchema,
  type TypeZodAddShareMutationSchema,
} from "@/trpc/routers/securities-router/schema";
import { type Share } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Documents, GeneralDetails, GeneralDetailsField } from "./steps";
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
  const { toast } = useToast();
  const router = useRouter();
  const addShareMutation = api.securities.addShares.useMutation({
    onSuccess: async ({ message, success }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: message,
        description: success
          ? "A new share has been created."
          : "Failed adding a share. Please try again.",
      });
      if (success) {
        router.refresh();
      }
    },
  });

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
      component: Documents,
      fields: ["documents"],
    },
  ];

  const onSubmit = async (data: TypeZodAddShareMutationSchema) => {
    await addShareMutation.mutateAsync(data);
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
        initialValues={initialValues}
      />
    </div>
  );
};

export default ShareModal;
