import Modal from "@/components/shared/modal";
type EquityPlanType = {
  trigger: React.ReactNode;
};

const EquityPlanModal = ({ trigger }: EquityPlanType) => {
  return (
    <Modal
      size="xl"
      title="Equity Plan"
      subtitle="Create a new equity plan"
      trigger={trigger}
    >
      <div>Form</div>
    </Modal>
  );
};

export default EquityPlanModal;
