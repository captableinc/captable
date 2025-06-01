import { PageLayout } from "@/components/dashboard/page-layout";
import { CompanyForm } from "@/components/onboarding/company-form";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/server/member";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Company",
};

const CompanySettingsPage = async () => {
  const { allow } = await serverAccessControl({ headers: await headers() });

  const data = await allow(api.company.getCompany.query(), [
    "company",
    "update",
  ]);

  if (!data?.company) {
    return <UnAuthorizedState />;
  }

  return <CompanyForm data={data} type="edit" />;
};

export default CompanySettingsPage;
