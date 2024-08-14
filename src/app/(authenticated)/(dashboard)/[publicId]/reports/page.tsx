import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
};

const ReportsPage = () => {
  return (
    <EmptyState
      icon={<Icon name="file-pdf-2-fill" />}
      title="No reports available."
      subtitle="Please click the button below to generate a report"
    >
      <Button>Coming soon...</Button>
    </EmptyState>
  );
};

export default ReportsPage;
