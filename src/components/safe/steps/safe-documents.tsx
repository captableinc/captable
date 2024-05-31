"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { StepperModalFooter, StepperPrev } from "@/components/ui/stepper";
import Uploader from "@/components/ui/uploader";
import { useFormValueState } from "@/providers/form-value-provider";
import { useState } from "react";
import type { FileWithPath } from "react-dropzone";

import { uploadFile } from "@/common/uploads";
import { invariant } from "@/lib/error";
import { TAG } from "@/lib/tags";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TFormSchema as TGeneralDetailsFormSchema } from "./general-details";
import type { TFormSchema as TInvestorDetailsFormSchema } from "./investor-details";

type TFormValueState = TGeneralDetailsFormSchema & TInvestorDetailsFormSchema;

export function SafeDocuments() {
  const router = useRouter();
  const { data: session } = useSession();
  const values = useFormValueState<TFormValueState>();
  const [documentsList, setDocumentsList] = useState<FileWithPath[]>([]);
  const { mutateAsync: handleBucketUpload } = api.bucket.create.useMutation();
  const { mutateAsync: handleCreateExistingSafe } =
    api.safe.addExisting.useMutation({
      onSuccess: ({ success }) => {
        if (success) {
          toast.success("SAFEs created successfully.");
          router.refresh();
        } else {
          toast.error("Failed creating SAFEs. Please try again.");
        }
      },
    });

  const handleComplete = async () => {
    invariant(session, "session not found");

    const uploadedDocuments: { name: string; bucketId: string }[] = [];

    for (const document of documentsList) {
      const { key, mimeType, name, size } = await uploadFile(document, {
        identifier: session.user.companyPublicId,
        keyPrefix: "existing-safes",
      });

      const { id: bucketId, name: docName } = await handleBucketUpload({
        key,
        mimeType,
        name,
        size,
        tags: [TAG.SAFE],
      });

      uploadedDocuments.push({ bucketId, name: docName });
    }

    await handleCreateExistingSafe({ ...values, documents: uploadedDocuments });
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Uploader
          multiple={true}
          identifier={""}
          keyPrefix="existing-safes"
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
        <DialogClose asChild>
          <Button
            disabled={documentsList.length === 0}
            onClick={handleComplete}
          >
            Submit
          </Button>
        </DialogClose>
      </StepperModalFooter>
    </div>
  );
}
