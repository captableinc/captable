import EmptyState from "@/components/common/empty-state";
import StakeholderDropdown from "@/components/stakeholder/stakeholder-dropdown";
import StakeholderTable from "@/components/stakeholder/stakeholder-table";
import { Card } from "@/components/ui/card";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";
import { RiGroup2Fill } from "@remixicon/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stakeholders",
};

const StakeholdersPage = async () => {
  const { allow } = await serverAccessControl();
  const stakeholders = await allow(api.stakeholder.getStakeholders.query(), [
    "stakeholder",
    "read",
  ]);

  const stakeholderDropdown = allow(
    <StakeholderDropdown />,
    ["stakeholder", "create"],
    null,
  );

  if (!stakeholders) {
    return <UnAuthorizedState />;
  }

  if (stakeholders.length === 0) {
    return (
      <EmptyState
        icon={<RiGroup2Fill />}
        title="You do not have any stakeholders!"
        subtitle="Please click the button below to add or import stakeholders."
      >
        {stakeholderDropdown}
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3">
        <div className="gap-y-3">
          <h3 className="font-medium">Stakeholders</h3>
          <p className="text-sm text-muted-foreground">
            Manage stakeholders for your company
          </p>
        </div>

        <div>{stakeholderDropdown}</div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <StakeholderTable stakeholders={stakeholders} />
      </Card>
    </div>
  );
};

export default StakeholdersPage;
