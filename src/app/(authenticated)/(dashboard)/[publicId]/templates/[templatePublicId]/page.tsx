import { api } from "@/trpc/server";
import { CanvasToolbar } from "@/components/template/canavs-toolbar";
import { PdfCanvas } from "@/components/template/pdf-canvas";
import { TemplateFieldProvider } from "@/providers/template-field-provider";

const TemplateDetailPage = async ({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) => {
  const { url, fields } = await api.template.get.query({
    publicId: templatePublicId,
  });

  return (
    <TemplateFieldProvider templatePublicId={templatePublicId} fields={fields}>
      <div className="grid grid-cols-12">
        <CanvasToolbar />
        <PdfCanvas url={url} />
      </div>
    </TemplateFieldProvider>
  );
};

export default TemplateDetailPage;
