import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { withServerSession } from "@/server/auth";
import { db } from "@/server/db";
import { RiAddLine, RiTerminalBoxFill } from "@remixicon/react";
import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "API Keys",
};
const ApiSettingsPage = async () => {
  const session = await withServerSession();
  const { user } = session;
  const apiKeys = await db.apiKey.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <Fragment>
      {apiKeys.length === 0 ? (
        <EmptyState
          bordered={false}
          icon={<RiTerminalBoxFill />}
          title="API Keys"
          subtitle="Create and manage API keys"
        >
          <Button>
            <RiAddLine className="inline-block h-5 w-5" />
            Create an API Key
          </Button>
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
              <Button className="w-full md:w-auto" size="sm">
                <RiAddLine className="inline-block h-5 w-5" />
                API Key
              </Button>
            </div>
          </div>

          <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
            {/* Table */}
          </Card>
        </div>
      )}
    </Fragment>
  );
};

export default ApiSettingsPage;
