import { api } from "@/trpc/server";
import { CanvasToolbar } from "@/components/template/canavs-toolbar";
import { PdfCanvas } from "@/components/template/pdf-canvas";
import { TemplateFieldProvider } from "@/providers/template-field-provider";
import { TemplateFieldForm } from "@/components/template/template-field-form";

const TemplateDetailPage = async ({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) => {
  const { url, fields } = await api.template.get.query({
    publicId: templatePublicId,
  });

  return (
    <TemplateFieldProvider fields={fields}>
      <TemplateFieldForm templatePublicId={templatePublicId}>
        <div className="grid grid-cols-12">
          <CanvasToolbar />
          <PdfCanvas url={url} />
        </div>
      </TemplateFieldForm>
    </TemplateFieldProvider>
  );
};

export default TemplateDetailPage;
