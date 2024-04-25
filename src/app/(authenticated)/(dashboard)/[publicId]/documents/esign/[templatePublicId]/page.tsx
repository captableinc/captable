import { CanvasToolbar } from "@/components/template/canavs-toolbar";
import { PdfCanvas } from "@/components/template/pdf-canvas";
import { TemplateFieldForm } from "@/components/template/template-field-form";
import { Badge } from "@/components/ui/badge";
import { ALL_RECIPIENT_VALUE } from "@/constants/esign";
import { TemplateFieldProvider } from "@/providers/template-field-provider";
import { api } from "@/trpc/server";

const EsignTemplateDetailPage = async ({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) => {
  const { name, status, url, fields, recipients } =
    await api.template.get.query({
      publicId: templatePublicId,
    });

  const recipientList = recipients.concat({
    id: ALL_RECIPIENT_VALUE,
    email: "All recipients",
  });
  return (
    <TemplateFieldProvider recipients={recipientList} fields={fields}>
      <TemplateFieldForm templatePublicId={templatePublicId}>
        <div className="grid grid-cols-12">
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
          <CanvasToolbar recipients={recipientList} />
          <PdfCanvas mode="edit" recipients={recipientList} url={url} />
        </div>
      </TemplateFieldForm>
    </TemplateFieldProvider>
  );
};

export default EsignTemplateDetailPage;
