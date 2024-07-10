import EmptyState from "@/components/common/empty-state";
import { Card } from "@/components/ui/card";
import { withServerComponentSession } from "@/server/auth";
import { db } from "@/server/db";
import { RiTerminalBoxFill } from "@remixicon/react";
import type { Metadata } from "next";
import { Fragment } from "react";
import CreateApiKey from "./components/create-key";
import ApiKeysTable from "./components/table";

export const metadata: Metadata = {
  title: "API Keys",
};
const ApiSettingsPage = async () => {
  const session = await withServerComponentSession();
  const { user } = session;
  const apiKeys = await db.apiKey.findMany({
    where: {
      userId: user.id,
      active: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      keyId: true,
      createdAt: true,
      lastUsed: true,
    },
  });

  console.log({ apiKeys });

  return (
    <Fragment>
      {apiKeys.length === 0 ? (
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

          <ApiKeysTable keys={apiKeys} />
        </div>
      )}
    </Fragment>
  );
};

export default ApiSettingsPage;
