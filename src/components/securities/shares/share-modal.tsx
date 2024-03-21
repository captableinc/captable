"use client";

import { useState } from "react";
import { GeneralDetails, GeneraLDetailsField } from "./steps";
import MultiStepFormModal from "@/components/shared/multistepFormModal";
import { ZodAddShareMutationSchema } from "@/trpc/routers/securities-router/schema";

type ShareModalProps = {
  title: string;
  subtitle: string | React.ReactNode;
  trigger: string | React.ReactNode;
};

const ShareModal = ({ title, subtitle, trigger }: ShareModalProps) => {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      id: 1,
      title: "General details",
      component: GeneralDetails,
      fields: GeneraLDetailsField,
    },
  ];

  const onSubmit = () => {
    console.log("do something");
  };

  return (
    <div>
      <MultiStepFormModal
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
        schema={ZodAddShareMutationSchema}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ShareModal;
