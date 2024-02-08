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
  return (
    <Modal size="2xl" title={title} subtitle={subtitle} trigger={trigger}>
      <EquityPlanForm />
    </Modal>
  );
};

export default EquityPlanModal;
