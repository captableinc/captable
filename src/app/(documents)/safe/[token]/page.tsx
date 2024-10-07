import { SafeSigningForm } from "@/components/safe/safe-signing-form";
import { SafeTemplateRenderer } from "@/components/safe/safe-template-render";
import { SigningFieldRenderer } from "@/components/signing-field/signing-field-renderer";
import { Button } from "@/components/ui/button";
import { SafeSigningFieldProvider } from "@/providers/safe-signing-field-provider";
import { api } from "@/trpc/server";

export default async function SafeSignPage({
  params,
}: { params: { token: string } }) {
  const fields = await api.safe.getSigningFields.query({ token: params.token });

  return (
    <SafeSigningFieldProvider safeId={fields.safeId} token={params.token}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex h-full flex-grow flex-col">
          <div className="mx-auto min-h-full w-full px-5 py-10 lg:px-8 2xl:max-w-screen-xl">
            <div className="grid grid-cols-12">
              <div className="col-span-12 ">
                <SafeTemplateRenderer />
              </div>
            </div>
          </div>
        </div>
        <div className="sticky top-0 flex min-h-full w-80 flex-col lg:border-l">
          <SafeSigningForm>
            <SigningFieldRenderer fields={fields.fields} />
            <Button type="submit">Complete signing</Button>
          </SafeSigningForm>
        </div>
      </div>
    </SafeSigningFieldProvider>
  );
}
