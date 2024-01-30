"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import EmptyOverview from "@/components/overview/empty";
import DonutCard from "@/components/overview/donut-card";
import OverviewCard from "@/components/overview/top-card";
import ActivitiesCard from "@/components/overview/activities-card";

const OverviewPage = () => {
  const params = useParams<{ publicId: string }>();
  const { data } = useSession();
  const firstName = data?.user.name?.split(" ")[0];
  const publicCompanyId = params.publicId;

  const byShareClasses = [
    {
      key: "Common - 53%",
      value: 53,
    },

    {
      key: "Preferred - 10%",
      value: 10,
    },

    // {
    //   key: "Preferred (Series A) - 23%",
    //   value: 15,
    // },

    // {
    //   key: "Preferred (Convertible note) - 7%",
    //   value: 7,
    // },

    {
      key: "Stock Plan - 15%",
      value: 15,
    },
  ];

  const byStakeholders = [
    {
      key: "John Doe",
      value: 27,
    },

    {
      key: "Jane Doe",
      value: 25,
    },

    // {
    //   key: "Others",
    //   value: 18,
    // },

    {
      key: "Equity Plan",
      value: 15,
    },

    {
      key: "Acme Ventures",
      value: 10,
    },

    {
      key: "Jane Doe",
      value: 5,
    },
  ];

  return (
    <>
      {/* <EmptyOverview firstName={firstName} publicCompanyId={publicCompanyId} /> */}

      <header>
        <h3 className="font-medium">Overview</h3>
        <p className="text-sm text-muted-foreground">
          View your company{`'`}s captable overview
        </p>
      </header>

      <div className="grid max-h-[500px] gap-8 md:grid-cols-12">
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-8">
          {/* Overview */}
          <section className="mt-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <OverviewCard
                title="Amount raised"
                amount={10000000}
                prefix="$"
              />
              <OverviewCard title="Diluted shares" amount={11567010} />
              <OverviewCard title="Stakeholders" amount={28} format={false} />
            </div>
          </section>

          {/* Donut charts */}
          <section className="mt-6">
            <div className="grid h-fit gap-4 sm:grid-cols-2  xl:grid-cols-2 ">
              <DonutCard
                title={
                  <>
                    <span className="text-xs text-muted-foreground">
                      Ownerships by{" "}
                    </span>
                    <span className="text-md font-semibold text-primary">
                      Stakeholders
                    </span>
                  </>
                }
                data={byStakeholders}
              />
              <DonutCard
                title={
                  <>
                    <span className="text-xs text-muted-foreground">
                      Ownerships by{" "}
                    </span>
                    <span className="text-md font-semibold text-primary">
                      Share Class
                    </span>
                  </>
                }
                data={byShareClasses}
              />
            </div>
          </section>
        </div>

        <div className="mt-6 sm:col-span-12 md:col-span-6 lg:col-span-4">
          <ActivitiesCard className="border-none bg-transparent shadow-none" />
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
