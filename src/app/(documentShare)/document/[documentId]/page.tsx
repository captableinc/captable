import { DocumentOTPForm } from "@/components/document/share/document-otp-form";

const DocumentPublicPage = async () => {
  return (
    <div className="grid h-screen w-full place-items-center bg-gray-100">
      <DocumentOTPForm />
    </div>
  );
};

export default DocumentPublicPage;
