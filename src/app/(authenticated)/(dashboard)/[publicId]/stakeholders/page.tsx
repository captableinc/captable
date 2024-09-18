import EmptyState from "@/components/common/empty-state";
import StakeholderDropdown from "@/components/stakeholder/stakeholder-dropdown";
import StakeholderTable from "@/components/stakeholder/stakeholder-table";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { getManyStakeholder } from "@/server/api/client-handlers/stakeholder";
import { ManyStakeholderQuerySchema } from "@/server/api/schema/stakeholder";
import { withServerSession } from "@/server/auth";
import { RiGroup2Fill } from "@remixicon/react";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Stakeholders",
};

const StakeholdersPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const session = await withServerSession();

  const { allow } = await serverAccessControl();

  const { limit, page, sort, name } =
    ManyStakeholderQuerySchema.parse(searchParams);

  const stakeholders = await allow(
    getManyStakeholder({
      searchParams: { limit, page, sort, ...(name && { name }) },
      urlParams: {
        companyId: session.user.companyId,
      },
      headers: headers(),
    }),
    ["stakeholder", "read"],
  );

  const stakeholderDropdown = allow(
    <StakeholderDropdown />,
    ["stakeholder", "create"],
    null,
  );

  if (!stakeholders) {
    return <UnAuthorizedState />;
  }

  if (
    stakeholders?.data &&
    stakeholders?.data.length === 0 &&
    Object.keys(searchParams).length === 0
  ) {
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

      <StakeholderTable
        limit={limit}
        page={page}
        sort={sort}
        stakeholders={stakeholders}
        name={name}
      />
    </div>
  );
};

export default StakeholdersPage;
