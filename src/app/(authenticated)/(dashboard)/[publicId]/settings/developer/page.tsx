import EmptyState from "@/components/common/empty-state";
import { api } from "@/trpc/server";
import { RiTerminalBoxFill } from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import CreateAccessToken from "./components/create-access-token";
import AccessTokenTable from "./components/table";

export const metadata: Metadata = {
  title: "Developer settings",
};
const AccessTokenPage = async () => {
  const data = await api.accessToken.listAll({
    typeEnum: "api",
  });

  return (
    <Fragment>
      {data.accessTokens.length === 0 ? (
        <EmptyState
          bordered={false}
          icon={<RiTerminalBoxFill />}
          title="Access tokens"
          subtitle={
            <p className="text-muted-foreground">
              Create an access token to get access to the API.{" "}
              <Link
                href="/docs/access-tokens"
                className="hover:underline text-teal-600"
                target="_blank"
              >
                Learn more
              </Link>
            </p>
          }
        >
          <CreateAccessToken />
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between gap-y-3 ">
            <div className="gap-y-3">
              <h3 className="font-medium">Access tokens</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage access tokens
              </p>
            </div>

            <div>
              <CreateAccessToken />
            </div>
          </div>

          <AccessTokenTable tokens={data.accessTokens} />
        </div>
      )}
    </Fragment>
  );
};

export default AccessTokenPage;
