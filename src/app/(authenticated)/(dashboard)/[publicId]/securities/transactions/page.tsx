import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { RiPieChartFill } from "@remixicon/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
};

const TransactionsPage = () => {
  return (
    <EmptyState
      icon={<RiPieChartFill />}
      title="Work in progress."
      subtitle="This page is not yet available."
    >
      <Button>Coming soon...</Button>
    </EmptyState>
  );
};

export default TransactionsPage;
