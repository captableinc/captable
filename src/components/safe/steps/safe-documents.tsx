"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { StepperModalFooter, StepperPrev } from "@/components/ui/stepper";
import Uploader from "@/components/ui/uploader";
import { useState } from "react";
import type { FileWithPath } from "react-dropzone";

export function SafeDocuments() {
  const [documentsList, setDocumentsList] = useState<FileWithPath[]>([]);

  const handleComplete = () => {};
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
