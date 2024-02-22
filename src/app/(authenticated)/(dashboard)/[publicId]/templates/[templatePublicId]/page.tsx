import { api } from "@/trpc/server";
import { FieldContextProvider } from "@/contexts/field-canvas-context";
import { CanvasToolbar } from "@/components/template/canavs-toolbar";
import { PdfCanvas } from "@/components/template/pdf-canvas";

const TemplateDetailPage = async ({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) => {
  const { url, fields } = await api.template.get.query({
    publicId: templatePublicId,
  });

  return (
    <FieldContextProvider fields={fields}>
      <div className="grid grid-cols-12">
        <CanvasToolbar templatePublicId={templatePublicId} />
        <PdfCanvas url={url} />
      </div>
    </FieldContextProvider>
  );
};

export default TemplateDetailPage;
