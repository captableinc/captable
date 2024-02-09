"use client";

import { useState } from "react";
import EquityPlanForm from "./form";
import Modal from "@/components/shared/modal";
import { type EquityPlanMutationType } from "@/trpc/routers/equity-plan/schema";

type EquityPlanType = {
  type: string;
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  trigger: React.ReactNode;
  equityPlan?: EquityPlanMutationType;
};

const EquityPlanModal = ({
  title,
  subtitle,
  trigger,
  equityPlan,
  type = "create",
}: EquityPlanType) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      size="xl"
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <EquityPlanForm type={type} setOpen={setOpen} equityPlan={equityPlan} />
    </Modal>
  );
};

export default EquityPlanModal;
