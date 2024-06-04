import { Pricing } from "@/components/billing/pricing";
import { PageLayout } from "@/components/dashboard/page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
};
const BillingPage = () => {
  return (
    <PageLayout title="Billing" description="manage your billing">
      <Pricing />
    </PageLayout>
  );
};

export default BillingPage;
