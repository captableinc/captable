import StakeholderDropdown from "@/components/stakeholder/stakeholder-dropdown";
import StakeholderTable from "@/components/stakeholder/stakeholder-table";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { withServerSession } from "@/server/auth";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
  const stakeholders = allow(true, ["stakeholder", "read"]);

  const stakeholderDropdown = allow(
    <StakeholderDropdown />,
    ["stakeholder", "create"],
    null,
  );

  if (!stakeholders) {
    return <UnAuthorizedState />;
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

      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense>
          <StakeholderTable companyId={session.user.companyId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default StakeholdersPage;
