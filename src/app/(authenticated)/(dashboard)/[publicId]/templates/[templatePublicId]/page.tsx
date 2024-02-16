import { api } from "@/trpc/server";
import { Card } from "@/components/ui/card";
import PdfViewer from "@/components/ui/pdf-viewer";

const TemplateDetailPage = async ({
  params,
}: {
  params: { templatePublicId: string };
}) => {
  const { url } = await api.template.get.query({
    publicId: params.templatePublicId,
  });

  return (
    <div className="grid grid-cols-12">
      <div className="relative col-span-12 h-full lg:col-span-6 xl:col-span-4">
        <Card className="fixed h-fit w-full max-w-[300px]">
          {/* Input fields */}
          <div className="h-[500px]">Sidebar</div>
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-8">
        <PdfViewer file={url} />
      </div>
    </div>
  );
};

export default TemplateDetailPage;
