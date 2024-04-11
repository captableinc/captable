import { PageLayout } from "@/components/dashboard/page-layout";
import { EquityDocumentUpload } from "@/components/equity/equity-document-upload";
import { withServerSession } from "@/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Esign",
};
const DocSign = async () => {
  const session = await withServerSession();
  const user = session.user;

  return (
    <PageLayout
      title="Equity"
      action={<EquityDocumentUpload companyPublicId={user.companyPublicId} />}
    />
  );
};

export default DocSign;
