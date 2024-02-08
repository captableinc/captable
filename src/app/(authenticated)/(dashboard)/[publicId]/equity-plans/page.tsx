"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChart2Line, RiAddFill } from "@remixicon/react";
import EquityPlanModal from "./components/modal";

const EquityPlanPage = () => {
  const params = useParams<{ publicId: string }>();
  const publicCompanyId = params.publicId;

  return (
    <EmptyState
      icon={<RiPieChart2Line />}
      title="You do not have any equity plans!"
      subtitle="Please click the button below to create a new equity plan."
    >
      {/* <Link href={`/${publicCompanyId}/equity-plans/new`} passHref>
        <Button size="lg">
          <RiAddFill className="mr-2 h-5 w-5" />
          Create an equity plan
        </Button>
      </Link> */}
      <EquityPlanModal
        trigger={
          <Button size="lg">
            <RiAddFill className="mr-2 h-5 w-5" />
            Create an equity plan
          </Button>
        }
      />
    </EmptyState>
  );
};

export default EquityPlanPage;
