import EmptyState from "@/components/common/empty-state";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";
import { RiBankFill } from "@remixicon/react";
import type { Metadata } from "next";
import { Fragment } from "react";
import CtaButton from "./components/cta-button";
import BankAccountsTable from "./components/table";

export const metadata: Metadata = {
  title: "Bank accounts",
};
const ApiSettingsPage = async () => {
  const { allow } = await serverAccessControl();

  const data = await allow(api.bankAccounts.getAll.query(), [
    "bank-accounts",
    "read",
  ]);

  if (!data) {
    return <UnAuthorizedState />;
  }

  return (
    <Fragment>
      {data.bankAccounts.length === 0 ? (
        <EmptyState
          bordered={false}
          icon={<RiBankFill />}
          title="Bank accounts"
          subtitle="Add a bank account to receive funds"
        >
          <CtaButton />
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between gap-y-3 ">
            <div className="gap-y-3">
              <h3 className="font-medium">Bank accounts</h3>
              <p className="text-sm text-muted-foreground">
                Add and manage bank account to receive funds
              </p>
            </div>

            <div>
              <CtaButton />
            </div>
          </div>

          <BankAccountsTable accounts={data.bankAccounts} />
        </div>
      )}
    </Fragment>
  );
};

export default ApiSettingsPage;
