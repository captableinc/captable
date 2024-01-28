"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChartFill, RiArrowRightLine } from "@remixicon/react";

const OverviewPage = () => {
  const params = useParams<{ publicId: string }>();
  const { data } = useSession();
  const firstName = data?.user.name?.split(" ")[0];
  const companyPublicId = params.publicId;

  return (
    <>
      <EmptyState
        icon={<RiPieChartFill />}
        title={`Welcome to OpenCap${firstName && `, ${firstName}`} 👋`}
        subtitle={
          <span className="text-muted-foreground">
            We will get you setup in no time.
          </span>
        }
      >
        <Button size="lg">
          <Link href={`/${companyPublicId}/stakeholders`}>
            Let{`'`}s get started
            <RiArrowRightLine className="ml-5 inline-block h-4 w-5" />
          </Link>
        </Button>
      </EmptyState>
    </>
  );
};

export default OverviewPage;
