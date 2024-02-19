import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiGroup2Fill } from "@remixicon/react";

const StakeholderPage = () => {
  return (
    <EmptyState
      icon={<RiGroup2Fill />}
      title="Work in progress."
      subtitle="This page is not yet available."
    >
      <Button size="lg">Import stakeholders</Button>
    </EmptyState>
  );
};

export default StakeholderPage;
