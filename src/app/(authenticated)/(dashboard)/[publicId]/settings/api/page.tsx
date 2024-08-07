import EmptyState from "@/components/common/empty-state";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";
import { RiTerminalBoxFill } from "@remixicon/react";
import type { Metadata } from "next";
import { Fragment } from "react";
import CreateApiKey from "./components/create-key";
import ApiKeysTable from "./components/table";

export const metadata: Metadata = {
  title: "API Keys",
};
const ApiSettingsPage = async () => {
  const { allow } = await serverAccessControl();

  const data = await allow(api.apiKey.listAll.query(), ["api-keys", "read"]);

  if (!data) {
    return <UnAuthorizedState />;
  }

  return (
    <Fragment>
      {data.apiKeys.length === 0 ? (
        <EmptyState
          bordered={false}
          icon={<RiTerminalBoxFill />}
          title="API Keys"
          subtitle="Create and manage API keys"
        >
          <CreateApiKey />
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between gap-y-3 ">
            <div className="gap-y-3">
              <h3 className="font-medium">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage API keys
              </p>
            </div>

            <div>
              <CreateApiKey />
            </div>
          </div>

          <ApiKeysTable keys={data.apiKeys} />
        </div>
      )}
    </Fragment>
  );
};

export default ApiSettingsPage;

// Great work with that push modal inside
// You can call it from anywhere ?? "":""
