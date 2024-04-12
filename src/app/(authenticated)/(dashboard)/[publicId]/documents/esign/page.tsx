import { PageLayout } from "@/components/dashboard/page-layout";
import EsignDocumentUpload from "@/components/documents/esign/document-uploader";
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
      title="eSign documents"
      description="Upload, sign and send documents for electronic signatures."
      action={<EsignDocumentUpload companyPublicId={user.companyPublicId} />}
    />
  );
};

export default DocSign;
