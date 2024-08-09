import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { RiPieChartFill } from "@remixicon/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investments",
};

const InvestmentsPage = () => {
  return (
    <EmptyState
      icon={<Icon name="pie-chart-fill" />}
      title="Work in progress."
      subtitle="This page is not yet available."
    >
      <Button>Coming soon...</Button>
    </EmptyState>
  );
};

export default InvestmentsPage;
