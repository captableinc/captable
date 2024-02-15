import { PdfViewer } from "@/components/ui/pdf-viewer";
import { api } from "@/trpc/server";

const TemplateDetailPage = async ({
  params,
}: {
  params: { templatePublicId: string };
}) => {
  const { url } = await api.document.get.query({
    publicId: params.templatePublicId,
  });

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-6 xl:col-span-4">sidebar</div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-8">
        <PdfViewer file={url} />
      </div>
    </div>
  );
};

export default TemplateDetailPage;
