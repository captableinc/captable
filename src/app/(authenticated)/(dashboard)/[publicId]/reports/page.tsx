import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiFilePdf2Fill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
};

const ReportsPage = () => {
  return (
    <EmptyState
      icon={<RiFilePdf2Fill />}
      title="No reports available."
      subtitle="Please click the button below to generate a report"
    >
      <Button size="lg">Generate a report</Button>
    </EmptyState>
  );
};

export default ReportsPage;
