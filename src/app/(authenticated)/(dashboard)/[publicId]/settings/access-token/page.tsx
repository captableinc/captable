import EmptyState from "@/components/common/empty-state";
import { api } from "@/trpc/server";
import { RiTerminalBoxFill } from "@remixicon/react";
import type { Metadata } from "next";
import { Fragment } from "react";
import CreateAccessToken from "./components/create-access-token";
import AccessTokenTable from "./components/table";

export const metadata: Metadata = {
  title: "Access Tokens",
};
const AccessTokenPage = async () => {
  const data = await api.accessToken.listAll.query();

  return (
    <Fragment>
      {data.apiKeys.length === 0 ? (
        <EmptyState
          bordered={false}
          icon={<RiTerminalBoxFill />}
          title="Access Tokens"
          subtitle="Create and manage access tokens"
        >
          <CreateAccessToken />
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between gap-y-3 ">
            <div className="gap-y-3">
              <h3 className="font-medium">Access Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage access tokens
              </p>
            </div>

            <div>
              <CreateAccessToken />
            </div>
          </div>

          <AccessTokenTable keys={data.apiKeys} />
        </div>
      )}
    </Fragment>
  );
};

export default AccessTokenPage;
