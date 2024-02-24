import CompanyForm from "@/components/onboarding/conpany-form";
import { withServerSession } from "@/server/auth";

const CompanySettingsPage = async () => {
  const session = await withServerSession();
  const user = session.user;

  return <CompanyForm formType="edit-company" currentUser={user} />;
};

export default CompanySettingsPage;
