import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChartFill, RiArrowRightLine } from "@remixicon/react";

type EmptyOverviewProps = {
  firstName: string | undefined;
  publicCompanyId: string;
};

const EmptyOverview = ({ firstName, publicCompanyId }: EmptyOverviewProps) => {
  return (
    <EmptyState
      icon={<RiPieChartFill />}
      title={`Welcome to OpenCap${firstName && `, ${firstName}`} 👋`}
      subtitle={
        <span className="text-muted-foreground">
          We will get you setup with your Captable in no time.
        </span>
      }
    >
      <Button size="lg">
        <Link href={`/${publicCompanyId}/stakeholders`}>
          Let{`'`}s get started
          <RiArrowRightLine className="ml-5 inline-block h-4 w-5" />
        </Link>
      </Button>
    </EmptyState>
  );
};

export default EmptyOverview;
