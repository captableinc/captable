import { CompanyForm } from "@/components/onboarding/company-form";
import { api } from "@/trpc/server";

const CompanySettingsPage = async () => {
  const data = await api.company.getCompany.query();

  return <CompanyForm data={data} type="edit" />;
};

export default CompanySettingsPage;
