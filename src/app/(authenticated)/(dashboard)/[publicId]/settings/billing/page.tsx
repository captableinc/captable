import { PlanDetails } from "@/components/billing/plan-details";
import { PageLayout } from "@/components/dashboard/page-layout";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
};
const BillingPage = async () => {
  const [{ products }, { subscription }] = await Promise.all([
    api.billing.getProducts.query(),
    api.billing.getSubscription.query(),
  ]);

  return (
    <PageLayout title="Billing" description="Manage payments and billing">
      <PlanDetails products={products} subscription={subscription} />
    </PageLayout>
  );
};

export default BillingPage;
