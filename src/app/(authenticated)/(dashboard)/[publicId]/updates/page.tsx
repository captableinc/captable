import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import UpdateTable from "@/components/update/update-table";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Updates",
};

const UpdatesPage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const updates = await api.update.get.query();

  if (updates.data.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="mail-send-line" />}
        title="You have not sent any updates."
        subtitle="Please click the button below to send an update to your stakeholders."
      >
        <Link href={`/${publicId}/updates/new`} passHref>
          <Button asChild>
            <Icon name="add-fill" className="mr-2 h-5 w-5" />
            Create an update
          </Button>
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3">
        <div className="gap-y-3">
          <h3 className="font-medium">Updates</h3>
          <p className="text-sm text-muted-foreground">
            Manage Investor Updates
          </p>
        </div>

        <div>
          <Link href={`/${publicId}/updates/new`} passHref>
            <Button asChild>
              <Icon name="add-fill" className="mr-2 h-5 w-5" />
              Draft an update
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <UpdateTable updates={updates.data} />
      </Card>
    </div>
  );
};

export default UpdatesPage;
