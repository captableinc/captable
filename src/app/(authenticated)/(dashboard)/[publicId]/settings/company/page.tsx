import { CompanyForm } from "@/components/onboarding/company-form";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company",
};

const CompanySettingsPage = async () => {
  const { allow } = await serverAccessControl();
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
