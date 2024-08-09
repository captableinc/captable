import { PdfCanvas } from "@/components/template/pdf-canvas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { TemplateSigningFieldProvider } from "@/providers/template-signing-field-provider";
import { api } from "@/trpc/server";
import { RiCheckFill } from "@remixicon/react";

type BadgeVariant =
  | "warning"
  | "info"
  | "success"
  | "secondary"
  | "destructive";

export default async function TemplateDetailViewPage({
  params: { templatePublicId },
}: {
  params: { templatePublicId: string };
}) {
  const { allow } = await serverAccessControl();

  const [{ name, status, url, fields }, auditsData] = await Promise.all([
    api.template.get.query({
      publicId: templatePublicId,
      isDraftOnly: false,
    }),

    allow(
      api.audit.allEsignAudits.query({
        templatePublicId: templatePublicId,
      }),
      ["audits", "read"],
      undefined,
    ),
  ]);

  const badgeVariant = (): BadgeVariant => {
    let result: BadgeVariant = "warning";

    if (status === "DRAFT") {
      result = "warning";
    } else if (status === "SENT") {
      result = "info";
    } else if (status === "COMPLETE") {
      result = "success";
    } else if (status === "WAITING") {
      result = "secondary";
    } else if (status === "CANCELLED") {
      result = "destructive";
    }
    return result;
  };

  return (
    <TemplateSigningFieldProvider fields={fields}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex h-full flex-grow flex-col">
          <div className="col-span-12 flex align-middle">
            <Badge variant={badgeVariant()} className="h-7 align-middle">
              {status}
            </Badge>
            <span className="ml-2 align-middle text-xl font-semibold">
              {name}
            </span>
          </div>
          <div className="mx-auto min-h-full w-full  py-10  2xl:max-w-screen-xl">
            <div className="grid grid-cols-12">
              <PdfCanvas mode="readonly" url={url} />
            </div>
          </div>
        </div>

        <div className="sticky top-0 -mt-7 flex min-h-full w-80 flex-col">
          {auditsData ? (
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">
                  eSigning activity logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditsData.audits.length ? (
                  <div className="flex  flex-col gap-y-3">
                    {auditsData.audits.map((item) => (
                      <div className="flex items-start gap-x-2" key={item.id}>
                        <div>
                          <div className="rounded-full bg-green-700 ">
                            <Icon
                              name="check-fill"
                              className="h-5 w-5 text-white"
                            />
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
          ) : null}
        </div>
      </div>
    </TemplateSigningFieldProvider>
  );
}
