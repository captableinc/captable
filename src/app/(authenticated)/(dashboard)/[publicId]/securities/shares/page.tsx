import ShareModal from "@/components/securities/shares/share-modal";
import ShareTable from "@/components/securities/shares/share-table";
import EmptyState from "@/components/shared/empty-state";
import Tldr from "@/components/shared/tldr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { RiAddFill, RiGroup2Fill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Shares",
};

const SharesPage = async () => {
  const shares = await api.securities.getShares.query();

  if (shares?.data?.length === 0) {
    return (
      <EmptyState
        icon={<RiGroup2Fill />}
        title="You do not have any shares yet."
        subtitle="Please click the button for adding new shares."
      >
        <ShareModal
          title="Create a share"
          subtitle={
            <Tldr
              message="Please fill in the details to create a share. If you need help, click the link below."
              cta={{
                label: "Learn more",
                href: "https://opencap.co/help/stakeholder-shares",
              }}
            />
          }
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Add a share
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
            Add shares for stakeholders
          </p>
        </div>
        <div>
          <ShareModal
            title="Draft Shares"
            subtitle={
              <Tldr
                message="Manage shares by adding them. 
               Add approval dates, notes, certificateId for the stakeholders. "
                cta={{
                  label: "Learn more",
                  href: "https://opencap.co/help/stakeholder-shares",
                }}
              />
            }
            trigger={<Button>Draft Shares</Button>}
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
