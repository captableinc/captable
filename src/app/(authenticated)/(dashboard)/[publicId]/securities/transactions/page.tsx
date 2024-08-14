import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
};

const TransactionsPage = () => {
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

export default TransactionsPage;
