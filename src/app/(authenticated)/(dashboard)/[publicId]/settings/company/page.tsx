import CompanyForm from "@/components/onboarding/conpany-form";
import { withServerSession } from "@/server/auth";
import { getCompany } from "@/server/company";

const CompanySettingsPage = async () => {
  const session = await withServerSession();
  const user = session.user;

  const companyResponse = await getCompany(user.id, user.companyId);

  return (
    <CompanyForm
      companyServerResponse={companyResponse}
      formType="edit-company"
      currentUser={user}
    />
  );
};

export default CompanySettingsPage;
