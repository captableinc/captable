import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { RiPieChartFill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Investments",
};

const InvestmentsPage = () => {
  return (
    <EmptyState
      icon={<RiPieChartFill />}
      title="Work in progress."
      subtitle="This page is not yet available."
    >
      <Button size="lg">Coming soon...</Button>
    </EmptyState>
  );
};

export default InvestmentsPage;
