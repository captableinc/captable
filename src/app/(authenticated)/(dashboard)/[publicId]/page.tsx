import ActivitiesCard from "@/components/dashboard/overview/activities-card";
import DonutCard from "@/components/dashboard/overview/donut-card";
import EmptyOverview from "@/components/dashboard/overview/empty";
import SummaryTable from "@/components/dashboard/overview/summary-table";
import OverviewCard from "@/components/dashboard/overview/top-card";
import { withServerComponentSession } from "@/server/auth";
import { getOverviewData } from "@/server/overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

const OverviewPage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const session = await withServerComponentSession();
  const companyId = session?.user?.companyId;
  const firstName = session?.user?.name?.split(" ")[0];

  const overview = companyId ? await getOverviewData(companyId) : null;

  if (!overview || overview.isEmpty) {
    return <EmptyOverview firstName={firstName} publicCompanyId={publicId} />;
  }

  return (
    <>
      <header>
        <h3 className="font-medium">Overview</h3>
        <p className="text-sm text-muted-foreground">
          View your company{`'`}s captable overview
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-8">
          {/* Overview */}
          <section className="mt-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <OverviewCard
                title="Amount raised"
                amount={overview.amountRaised}
                prefix="$"
              />
              <OverviewCard
                title="Diluted shares"
                amount={overview.fullyDilutedShares}
              />
              <OverviewCard
                title="Stakeholders"
                amount={overview.stakeholderCount}
                format={false}
              />
            </div>
          </section>

          {/* Tremor chart */}
          <section className="mt-6">
            <DonutCard
              stakeholders={overview.ownershipByStakeholder}
              shareClasses={overview.ownershipByShareClass}
            />
          </section>
        </div>

        <div className="mt-6 sm:col-span-12 md:col-span-6 lg:col-span-4">
          <ActivitiesCard
            publicId={publicId}
            className="border-none bg-transparent shadow-none"
          />
        </div>
      </div>

      <div className="mt-10">
        <h4 className="font-medium">Summary</h4>
        <p className="text-sm text-muted-foreground">
          Summary of your company{`'`}s captable
        </p>

        <SummaryTable
          rows={overview.summary}
          totalRaised={overview.totalRaised}
        />
      </div>
    </>
  );
};

export default OverviewPage;
