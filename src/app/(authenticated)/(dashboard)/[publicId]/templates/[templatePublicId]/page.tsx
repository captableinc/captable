import { CanvasToolbar } from "@/components/template/canavs-toolbar";
import { PdfCanvas } from "@/components/template/pdf-canvas";
import { TemplateFieldForm } from "@/components/template/template-field-form";
import { Badge } from "@/components/ui/badge";
import { TemplateFieldProvider } from "@/providers/template-field-provider";
import { api } from "@/trpc/server";

const TemplateDetailPage = async ({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) => {
  const { name, status, url, fields } = await api.template.get.query({
    publicId: templatePublicId,
  });

  return (
    <TemplateFieldProvider fields={fields}>
      <TemplateFieldForm templatePublicId={templatePublicId}>
        <div className="grid grid-cols-12">
          <CanvasToolbar />
          <div className="col-span-12 flex align-middle">
            <Badge
              variant={status === "DRAFT" ? "warning" : "success"}
              className="h-7 align-middle"
            >
              {status}
            </Badge>
            <span className="ml-2 align-middle text-xl font-semibold">
              {name}
            </span>
          </div>
          <PdfCanvas url={url} />
        </div>
      </TemplateFieldForm>
    </TemplateFieldProvider>
  );
};

export default TemplateDetailPage;
