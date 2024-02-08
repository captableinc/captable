import { useState } from "react";
import EquityPlanForm from "./form";
import Modal from "@/components/shared/modal";
import type { EquityPlan } from "@prisma/client";

type EquityPlanType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  trigger: React.ReactNode;
  equityPlan?: EquityPlan;
};

const EquityPlanModal = ({
  title,
  subtitle,
  trigger,
  equityPlan,
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
      <EquityPlanForm setOpen={setOpen} />
    </Modal>
  );
};

export default EquityPlanModal;
