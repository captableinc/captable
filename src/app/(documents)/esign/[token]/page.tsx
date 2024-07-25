import EmptyState from "@/components/common/empty-state";
import { PdfCanvas } from "@/components/template/pdf-canvas";
import { SigningFields } from "@/components/template/signing-fields";
import { TemplateSigningFieldProvider } from "@/providers/template-signing-field-provider";
import { getServerComponentAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document signing",
};

interface SigningPageProps {
  params: {
    token: string;
  };
}

export default async function SigningPage(props: SigningPageProps) {
  const { token } = props.params;

  const {
    fields,
    url,
    recipientId,
    templateId,
    signableFields,
    status: templateStatus,
  } = await api.template.getSigningFields.query({
    token,
  });

  const session = await getServerComponentAuthSession();
  const companyPublicId = session?.user.companyPublicId;

  if (templateStatus === "CANCELLED") {
    return (
      <EmptyState
        title={"Cancelled"}
        subtitle={"This document signing has been cancelled."}
        error={true}
      />
    );
  }

  return (
    <TemplateSigningFieldProvider fields={fields}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex h-full flex-grow flex-col">
          <div className="mx-auto min-h-full w-full px-5 py-10 lg:px-8 2xl:max-w-screen-xl">
            <div className="grid grid-cols-12">
              <PdfCanvas mode="readonly" url={url} />
            </div>
          </div>
        </div>
        <div className="sticky top-0 flex min-h-full w-80 flex-col lg:border-l">
          <SigningFields
            recipientId={recipientId}
            templateId={templateId}
            fields={signableFields}
            companyPublicId={companyPublicId}
          />
        </div>
      </div>
    </TemplateSigningFieldProvider>
  );
}
