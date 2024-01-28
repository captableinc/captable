import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChartFill } from "@remixicon/react";

const CaptablePage = () => {
  return (
    <EmptyState
      icon={<RiPieChartFill />}
      title="Work in progress."
      subtitle="This page is not yet available."
    >
      <Button size="lg">Import existing captable</Button>
    </EmptyState>
  );
};

export default CaptablePage;
