import EmptyState from "@/components/common/empty-state";
import Tldr from "@/components/common/tldr";
import { ShareModal } from "@/components/securities/shares/share-modal";
import ShareTable from "@/components/securities/shares/share-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { RiAddFill, RiPieChartFill } from "@remixicon/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Captable | Shares",
};

const SharesPage = async () => {
  const shares = await api.securities.getShares.query();

  if (shares?.data?.length === 0) {
    return (
      <EmptyState
        icon={<RiPieChartFill />}
        title="You have not issued any shares"
        subtitle="Please click the button below to start issuing shares."
      >
        <ShareModal
          size="4xl"
          title="Create a share"
          subtitle="Please fill in the details to create and issue a share."
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Create a share
            </Button>
          }
        />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Shares</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Issue shares to stakeholders
          </p>
        </div>
        <div>
          <ShareModal
            size="4xl"
            title="Create a share"
            subtitle="Please fill in the details to create and issue a share."
            trigger={
              <Button>
                <RiAddFill className="mr-2 h-5 w-5" />
                Create a share
              </Button>
            }
          />
        </div>
      </div>
      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <ShareTable shares={shares.data} />
      </Card>
    </div>
  );
};

export default SharesPage;
