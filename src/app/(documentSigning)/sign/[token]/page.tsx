import { PdfCanvas } from "@/components/template/pdf-canvas";
import { SigningFields } from "@/components/template/signing-fields";
import { TemplateFieldProvider } from "@/providers/template-field-provider";
import { api } from "@/trpc/server";

interface SigningPageProps {
  params: {
    token: string;
  };
}

export default async function SigningPage(props: SigningPageProps) {
  const { fields, url } = await api.template.get.query({
    publicId: props.params.token,
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex h-full flex-grow flex-col">
        <div className="mx-auto min-h-full w-full px-5 py-10 lg:px-8 2xl:max-w-screen-xl">
          <TemplateFieldProvider fields={fields}>
            <div className="grid grid-cols-12">
              <PdfCanvas mode="readonly" url={url} />
            </div>
          </TemplateFieldProvider>
        </div>
      </div>
      <div className="sticky top-0 flex min-h-full w-80 flex-col lg:border-l">
        <SigningFields token={props.params.token} fields={fields} />
      </div>
    </div>
  );
}
