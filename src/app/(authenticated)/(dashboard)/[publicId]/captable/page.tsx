import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChartFill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Cap table",
};

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
