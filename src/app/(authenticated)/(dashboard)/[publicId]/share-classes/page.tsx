import EmptyState from "@/components/common/empty-state";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { withServerComponentSession } from "@/server/auth";
import { db } from "@/server/db";
import type { ShareClassMutationType } from "@/trpc/routers/share-class/schema";
import type { Metadata } from "next";
import { CreateShareButton } from "./create-share-class-button";
import ShareClassTable from "./table";

export const metadata: Metadata = {
  title: "Share classes",
};

const getShareClasses = async (companyId: string) => {
  return await db.shareClass.findMany({
    where: { companyId },
  });
};

const SharesPage = async () => {
  const session = await withServerComponentSession();
  const companyId = session?.user?.companyId;
  let shareClasses: ShareClassMutationType[] = [];

  if (companyId) {
    shareClasses = (await getShareClasses(
      companyId,
    )) as unknown as ShareClassMutationType[];
  }

  if (shareClasses.length === 0) {
    return (
      <EmptyState
        icon={<RiPieChart2Line />}
        title="You do not have any share classes!"
        subtitle="Please click the button below to create a new share class."
      >
        <CreateShareButton shareClasses={shareClasses} />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Share classes</h3>
          <p className="text-sm text-muted-foreground">
            Manage your company{`'`}s share classes
          </p>
        </div>

        <div>
          <CreateShareButton shareClasses={shareClasses} />
        </div>
      </div>

      <Card className="mt-3">
        <div className="p-6">
          <ShareClassTable shareClasses={shareClasses} />
        </div>
      </Card>
    </div>
  );
};

export default SharesPage;
