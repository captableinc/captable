"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import EmptyOverview from "@/components/overview/empty";
import { Flex, Grid, Col, Card, Text, Metric } from "@tremor/react";

const OverviewPage = () => {
  const params = useParams<{ publicId: string }>();
  const { data } = useSession();
  const firstName = data?.user.name?.split(" ")[0];
  const publicCompanyId = params.publicId;

  return (
    <>
      {/* <EmptyOverview firstName={firstName} publicCompanyId={publicCompanyId} /> */}

      <div className="xs:grid-cols-1 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
        <Card>
          <Text>Title</Text>
          <Metric>KPI 1</Metric>
        </Card>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 2</Metric>
        </Card>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 3</Metric>
        </Card>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 4</Metric>
        </Card>
      </div>
    </>
  );
};

export default OverviewPage;
