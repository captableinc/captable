"use client";

import MultiStepModal from "@/components/common/multistep-modal";
import { api } from "@/trpc/react";
import {
  type TypeZodAddOptionMutationSchema,
  ZodAddOptionMutationSchema,
} from "@/trpc/routers/securities-router/schema";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Documents,
  GeneralDetails,
  GeneralDetailsField,
  RelevantDates,
  RelevantDatesFields,
  VestingDetails,
  VestingDetailsFields,
} from "./steps";

type OptionModalProps = {
  title: string;
  subtitle: string | React.ReactNode;
  trigger: string | React.ReactNode;
};

const OptionModal = ({ title, subtitle, trigger }: OptionModalProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const addOptionMutation = api.securities.addOptions.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("A new stakeholder option has been created.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Failed adding an option. Please try again.");
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
      title: "Vesting details",
      component: VestingDetails,
      fields: VestingDetailsFields,
    },
    {
      id: 3,
      title: "Relevant dates",
      component: RelevantDates,
      fields: RelevantDatesFields,
    },
    {
      id: 4,
      title: "Documents",
      component: Documents,
      fields: ["documents"],
    },
  ];

  const onSubmit = async (data: TypeZodAddOptionMutationSchema) => {
    if (data?.documents.length === 0) {
      toast.error(
        "Uh ohh! Documents not found, please upload necessary documents",
      );
      return;
    }

    await addOptionMutation.mutateAsync(data);
  };
  return (
    <div>
      <MultiStepModal
        steps={steps}
        title={title}
        subtitle={subtitle}
        trigger={trigger}
        dialogProps={{
          open,
          onOpenChange: (val) => {
            setOpen(val);
          },
        }}
        schema={ZodAddOptionMutationSchema}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default OptionModal;
