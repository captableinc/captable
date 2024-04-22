import { PageLayout } from "@/components/dashboard/page-layout";
import { AddEsignModal } from "@/components/esign/add-esign-modal";
import { withServerSession } from "@/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
};

const EsignDocumentPage = async () => {
  const session = await withServerSession();

  return (
    <PageLayout
      title="eSign documents"
      description="Upload, sign and send documents for electronic signatures."
      action={<AddEsignModal companyPublicId={session.user.companyPublicId} />}
    />
  );
};

export default EsignDocumentPage;
