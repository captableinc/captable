import { PdfCanvas } from "@/components/template/pdf-canvas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateSigningFieldProvider } from "@/providers/template-signing-field-provider";
import { api } from "@/trpc/server";
import { RiCheckFill } from "@remixicon/react";

export default async function TemplateDetailViewPage({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) {
  const [{ url, fields }, { audits }] = await Promise.all([
    api.template.get.query({
      publicId: templatePublicId,
      isDraftOnly: false,
    }),
    api.audit.allEsignAudits.query({
      templatePublicId: templatePublicId,
    }),
  ]);

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
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle>eSigning activity logs</CardTitle>
            </CardHeader>
            <CardContent>
              {audits.length ? (
                <div className="flex  flex-col gap-y-3">
                  {audits.map((item) => (
                    <div className="flex items-start gap-x-2" key={item.id}>
                      <div>
                        <div className="rounded-full bg-green-700 ">
                          <RiCheckFill className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <p className="break-words text-sm font-medium text-primary/80">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>No logs to show</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TemplateSigningFieldProvider>
  );
}
