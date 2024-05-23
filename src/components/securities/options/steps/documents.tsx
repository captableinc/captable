"use client";

import { uploadFile } from "@/common/uploads";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { StepperModalFooter, StepperPrev } from "@/components/ui/stepper";
import Uploader from "@/components/ui/uploader";
import { invariant } from "@/lib/error";
import { useStockOptionFormValues } from "@/providers/stock-option-form-provider";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FileWithPath } from "react-dropzone";
import { toast } from "sonner";

export const Documents = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { value } = useStockOptionFormValues();
  const [documentsList, setDocumentsList] = useState<FileWithPath[]>([]);
  const { mutateAsync: handleBucketUpload } = api.bucket.create.useMutation();
  const { mutateAsync: addOptionMutation } =
    api.securities.addOptions.useMutation({
      onSuccess: ({ success }) => {
        invariant(session, "session not found");

        if (success) {
          toast.success("A new stakeholder option has been created.");
          router.refresh();
          router.push(`/${session.user.companyPublicId}/securities/options`);
        } else {
          toast.error("Failed adding an option. Please try again.");
        }
      },
    });

  const handleComplete = async () => {
    invariant(session, "session not found");

    const uploadedDocuments: { name: string; bucketId: string }[] = [];

    for (const document of documentsList) {
      const { key, mimeType, name, size } = await uploadFile(document, {
        identifier: session.user.companyPublicId,
        keyPrefix: "stockOptionDocs",
      });

      const { id: bucketId, name: docName } = await handleBucketUpload({
        key,
        mimeType,
        name,
        size,
      });

      uploadedDocuments.push({ bucketId, name: docName });
    }

    await addOptionMutation({ ...value, documents: uploadedDocuments });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Uploader
          multiple={true}
          identifier={""}
          keyPrefix="equity-doc"
          shouldUpload={false}
          onSuccess={(bucketData) => {
            setDocumentsList(bucketData);
          }}
          accept={{
            "application/pdf": [".pdf"],
          }}
        />
        {documentsList?.length ? (
          <Alert className="mt-5 bg-teal-100" variant="default">
            <AlertTitle>
              {documentsList.length > 1
                ? `${documentsList.length} documents uploaded`
                : `${documentsList.length} document uploaded`}
            </AlertTitle>
            <AlertDescription>
              You can submit the form to proceed.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive" className="mt-5">
            <AlertTitle>0 document uploaded</AlertTitle>
            <AlertDescription>
              Please upload necessary documents to continue.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <StepperModalFooter>
        <StepperPrev>Back</StepperPrev>
        <Button disabled={documentsList.length === 0} onClick={handleComplete}>
          Submit
        </Button>
      </StepperModalFooter>
    </div>
  );
};
