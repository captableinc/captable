import CaptableMatrix from "@/components/captable/captable-matrix";
import ConvertiblesCard from "@/components/captable/convertibles-card";
import EmptyState from "@/components/common/empty-state";
import OverviewCard from "@/components/dashboard/overview/top-card";
import { Button } from "@/components/ui/button";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { withServerComponentSession } from "@/server/auth";
import { getCapTable } from "@/server/captable";
import { RiPieChartFill } from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cap table",
};

const CaptablePage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const { allow } = await serverAccessControl();

  const canView = allow(true, ["stakeholder", "read"]);

  if (!canView) {
    return <UnAuthorizedState />;
  }

  const session = await withServerComponentSession();
  const companyId = session?.user?.companyId;

  const capTable = companyId ? await getCapTable(companyId) : null;

  if (!capTable || capTable.summary.isEmpty) {
    return (
      <EmptyState
        icon={<RiPieChartFill />}
        title="Your cap table is empty"
        subtitle="Issue shares, grant options or record fundraising to see your ownership breakdown."
      >
        <Button size="lg">
          <Link href={`/${publicId}/securities/shares`}>Issue shares</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="gap-y-3">
        <h3 className="font-medium">Cap table</h3>
        <p className="text-sm text-muted-foreground">
          Fully-diluted ownership of your company by stakeholder
        </p>
      </div>

      <section className="mt-3">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Fully-diluted shares"
            amount={capTable.summary.fullyDilutedShares}
          />
          <OverviewCard
            title="Amount raised"
            amount={capTable.summary.amountRaised}
            prefix="$"
          />
          <OverviewCard
            title="Stakeholders"
            amount={capTable.summary.stakeholderCount}
            format={false}
          />
        </div>
      </section>

      <CaptableMatrix
        shareClasses={capTable.shareClasses}
        rows={capTable.rows}
        pool={capTable.pool}
        totals={capTable.totals}
      />

      <ConvertiblesCard
        safes={capTable.convertibles.safes}
        notes={capTable.convertibles.notes}
        totalCapital={capTable.convertibles.totalCapital}
      />
    </div>
  );
};

export default CaptablePage;
