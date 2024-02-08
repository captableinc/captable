"use client";
import EquityPlanModal from "./modal";
import { useParams } from "next/navigation";
import Tldr from "@/components/shared/tldr";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChart2Line, RiAddFill } from "@remixicon/react";

const EquityPlanPage = () => {
  const params = useParams<{ publicId: string }>();
  const publicCompanyId = params.publicId;

  return (
    <EmptyState
      icon={<RiPieChart2Line />}
      title="You do not have any equity plans!"
      subtitle="Please click the button below to create a new equity plan."
    >
      <EquityPlanModal
        title="Create an equity plan"
        subtitle={
          <Tldr
            message="Equity plans are used to distribute ownership of your company using stock options, RSUs, and other instruments among employees and stakeholders."
            cta={{
              label: "Learn more",
              // TODO - this link should be updated to the correct URL
              href: "https://opencap.co/help",
            }}
          />
        }
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
