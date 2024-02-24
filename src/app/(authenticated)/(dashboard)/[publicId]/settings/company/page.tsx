import CompanyForm from "@/components/onboarding/conpany-form";
import { withServerSession } from "@/server/auth";

const CompanySettingsPage = async () => {
  const session = await withServerSession();
  const user = session.user;

  return <CompanyForm currentUser={user} />;
};

export default CompanySettingsPage;
