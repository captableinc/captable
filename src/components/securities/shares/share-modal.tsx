"use client";

import MultiStepModal from "@/components/common/multistep-modal";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import {
  type TypeZodAddShareMutationSchema,
  ZodAddShareMutationSchema,
} from "@/trpc/routers/securities-router/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ContributionDetails,
  ContributionDetailsField,
  DocumentFields,
  Documents,
  GeneralDetails,
  GeneralDetailsField,
  RelevantDates,
  RelevantDatesFields,
} from "./steps";

type ShareModalProps = {
  title: string;
  subtitle: string | React.ReactNode;
  trigger: string | React.ReactNode;
};

const ShareModal = ({ title, subtitle, trigger }: ShareModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const addShareMutation = api.securities.addShares.useMutation({
    onSuccess: ({ message, success }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: message,
        description: success
          ? "A new share has been created."
          : "Failed adding a share. Please try again.",
      });
      if (success) {
        setOpen(false);
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
      fields: DocumentFields,
    },
  ];

  const onSubmit = async (data: TypeZodAddShareMutationSchema) => {
    await addShareMutation.mutateAsync(data);
  };

  return (
    <div>
      <MultiStepModal
        steps={steps}
        title={title}
        subtitle={subtitle}
        trigger={trigger}
        schema={ZodAddShareMutationSchema}
        onSubmit={onSubmit}
        dialogProps={{ open, onOpenChange: (val) => setOpen(val) }}
      />
    </div>
  );
};

export default ShareModal;
