import OverviewCard from "@/components/dashboard/overview/top-card";
import ActivitiesCard from "@/components/dashboard/overview/activities-card";
import DonutCard from "@/components/dashboard/overview/donut-card";
import SummaryTable from "@/components/dashboard/overview/summary-table";

const OverviewPage = ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  return (
    <>
      {/* <EmptyOverview firstName={firstName} publicCompanyId={publicCompanyId} /> */}

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
                amount={28000000}
                prefix="$"
              />
              <OverviewCard title="Diluted shares" amount={7560010} />
              <OverviewCard title="Stakeholders" amount={28} format={false} />
            </div>
          </section>

          {/* Tremor chart */}
          <section className="mt-6">
            <DonutCard />
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

        <SummaryTable />
      </div>
    </>
  );
};

export default OverviewPage;
