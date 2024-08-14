import EmptyState from "@/components/common/empty-state";
import { PageLayout } from "@/components/dashboard/page-layout";
import { SafeActions } from "@/components/safe/safe-actions";
import { SafeTable } from "@/components/safe/safe-table";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAFEs",
};

const SafePage = async () => {
  const safes = await api.safe.getSafes.query();

  if (!safes?.data?.length) {
    return (
      <EmptyState
        icon={<Icon name="safe-fill" />}
        title="Create and manage SAFE agreements."
        subtitle="Please click the button for creating agreements."
      >
        <SafeActions />
      </EmptyState>
    );
  }
  return (
    <PageLayout
      title="SAFEs"
      description="Create and manage SAFE agreements for your company."
      action={<SafeActions />}
    >
      <Card className="mt-3">
        <div className="p-6">
          <SafeTable safes={safes.data} />
        </div>
      </Card>
    </PageLayout>
  );
};

export default SafePage;
